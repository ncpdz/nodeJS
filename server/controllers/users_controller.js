const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

class UsersController {
  static async index(req, res) {
    try {
      const users = await User.findAll();
      res.render("users/index", { users });
    } catch (error) {
      console.error(error);
      res.status(500).send("Đã xảy ra lỗi khi lấy danh sách người dùng.");
    }
  }

  static registerValidators = [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Tên đăng nhập là bắt buộc.")
      .isLength({ min: 3 })
      .withMessage("Tên đăng nhập phải có ít nhất 3 ký tự."),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email là bắt buộc.")
      .isEmail()
      .withMessage("Email không hợp lệ."),
    body("password")
      .notEmpty()
      .withMessage("Mật khẩu là bắt buộc.")
      .isLength({ min: 5 })
      .withMessage("Mật khẩu phải có ít nhất 5 ký tự."),
  ];

  static async register(req, res) {
    const { username, password, email } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      return res
        .status(400)
        .render("users/register", { error: errorMessages.join(" ") });
    }

    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res
          .status(400)
          .render("users/register", { error: "Tên đăng nhập đã tồn tại." });
      }

      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res
          .status(400)
          .render("users/register", { error: "Email đã được sử dụng." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        username,
        password: hashedPassword,
        email,
      });

      req.session.userId = newUser.id;
      req.session.role = newUser.role;
      req.session.username = newUser.username;

      return res.redirect("/users/login");
    } catch (error) {
      console.error(error);
      res.status(500).render("users/register", {
        error: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      });
    }
  }

  static loginValidators = [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Tên đăng nhập là bắt buộc."),
    body("password").notEmpty().withMessage("Mật khẩu là bắt buộc."),
  ];

  static async login(req, res) {
    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      return res
        .status(400)
        .render("users/login", { error: errorMessages.join(" ") });
    }

    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res
          .status(404)
          .render("users/login", { error: "Người dùng không tồn tại." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .render("users/login", { error: "Mật khẩu không chính xác." });
      }

      if (user.isActive == 2) {
        return res
          .status(403)
          .render("users/login", { error: "Tài khoản của bạn đã bị khóa." });
      }

      req.session.userId = user.id;
      req.session.role = user.role;
      req.session.username = user.username;

      const redirectUrl =
        user.role === "admin" ? "/products" : "http://localhost:5173/";

      return res.redirect(redirectUrl);
    } catch (error) {
      console.error(error);
      return res.status(500).render("users/login", {
        error: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      });
    }
  }
  static async currentUser(req, res) {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Chưa đăng nhập." }); // Not logged in
    }

    try {
      const user = await User.findByPk(req.session.userId); // Get user by ID from session
      if (!user) {
        return res.status(404).json({ error: "Người dùng không tồn tại." });
      }

      return res.status(200).json({
        id: user.id,
        username: user.username,
        role: user.role,
      }); // Return user data
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Đã xảy ra lỗi. Vui lòng thử lại sau." });
    }
  }

  static async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Đã xảy ra lỗi khi đăng xuất.");
      }
      res.redirect("/users/login");
    });
  }

  static async edit(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send("Người dùng không tồn tại.");
      }
      res.render("users/edit", { user });
    } catch (error) {
      console.error(error);
      res.status(500).send("Đã xảy ra lỗi khi lấy thông tin người dùng.");
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { username, email, role } = req.body;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send("Người dùng không tồn tại.");
      }

      await User.update({ username, email, role }, { where: { id } });
      res.redirect("/users");
    } catch (error) {
      console.error(error);
      res.status(500).send("Đã xảy ra lỗi khi cập nhật người dùng.");
    }
  }

  static async delete(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send("Người dùng không tồn tại.");
      }

      await User.destroy({ where: { id } });
      res.redirect("/users");
    } catch (error) {
      console.error(error);
      res.status(500).send("Đã xảy ra lỗi khi xóa người dùng.");
    }
  }

  static async toggleActive(req, res) {
    const userId = req.params.id;

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send("Người dùng không tồn tại.");
      }

      user.isActive = user.isActive == 1 ? 2 : 1;
      await user.save();

      res.redirect("/users");
    } catch (error) {
      console.error(error);
      res.status(500).send("Đã xảy ra lỗi khi cập nhật trạng thái người dùng.");
    }
  }
}

module.exports = UsersController;
