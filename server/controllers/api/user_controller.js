const bcrypt = require("bcrypt");
const { User } = require("../../models/index");
const { validationResult } = require("express-validator");

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
};

class ApiUserController {
  static async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: "Tên đăng nhập đã tồn tại." });
      }

      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ error: "Email đã được sử dụng." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: "user", 
        isActive: true, 
      });

      req.session.userId = newUser.id;
      req.session.role = newUser.role;

      res.status(201).json({
        message: "Đăng ký thành công.",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ error: "Người dùng không tồn tại." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Mật khẩu không chính xác." });
      }

      if (!user.isActive) {
        return res.status(403).json({ error: "Tài khoản của bạn đã bị khóa." });
      }

      req.session.userId = user.id;
      req.session.role = user.role;

      res.status(200).json({
        message: "Đăng nhập thành công.",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  static async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Đã xảy ra lỗi khi đăng xuất." });
      }
      res.clearCookie("connect.sid"); 
      res.status(200).json({ message: "Đăng xuất thành công." });
    });
  }

  static async getAllUsers(req, res) {
    if (req.session && req.session.userId) {
      try {
        const users = await User.findAll({
          attributes: ["id", "username", "email", "role"], 
        });

        res.status(200).json({ users });
      } catch (error) {
        handleError(res, error);
      }
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }

  static async update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.session && req.session.userId) {
      try {
        const user = await User.findByPk(req.session.userId);
        if (!user) {
          return res.status(404).json({ error: "User not found." });
        }

        const { username, email, password } = req.body;

        let hashedPassword = user.password;
        if (password) {
          hashedPassword = await bcrypt.hash(password, 10);
        }

        await user.update({
          username: username || user.username,
          email: email || user.email,
          password: hashedPassword,
        });

        res.status(200).json({
          message: "Cập nhật thành công.",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      } catch (error) {
        handleError(res, error);
      }
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }

  static async delete(req, res) {
    if (req.session && req.session.userId) {
      try {
        const user = await User.findByPk(req.session.userId);
        if (!user) {
          return res.status(404).json({ error: "User not found." });
        }

        if (user.role !== "admin") {
          return res
            .status(403)
            .json({ error: "Forbidden: Only admin can delete users." });
        }

        const { id } = req.params;
        const userToDelete = await User.findByPk(id);
        if (!userToDelete) {
          return res.status(404).json({ error: "User to delete not found." });
        }

        await userToDelete.destroy();
        res.status(200).json({ message: "User deleted successfully." });
      } catch (error) {
        handleError(res, error);
      }
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }
}

module.exports = ApiUserController;