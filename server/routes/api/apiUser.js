const express = require("express");
const router = express.Router();
const ApiUserController = require("../../controllers/api/user_controller");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../../middleware/auth");


const registerValidation = [
  body("username")
    .notEmpty().withMessage("Tên đăng nhập là bắt buộc.")
    .isLength({ min: 3 }).withMessage("Tên đăng nhập phải ít nhất 3 ký tự."),
  body("email")
    .isEmail().withMessage("Email không hợp lệ."),
  body("password")
    .isLength({ min: 6 }).withMessage("Mật khẩu phải ít nhất 6 ký tự."),
];

const loginValidation = [
  body("username").notEmpty().withMessage("Tên đăng nhập là bắt buộc."),
  body("password").notEmpty().withMessage("Mật khẩu là bắt buộc."),
];

const updateValidation = [
  body("username")
    .optional()
    .notEmpty().withMessage("Tên đăng nhập không được để trống.")
    .isLength({ min: 3 }).withMessage("Tên đăng nhập phải ít nhất 3 ký tự."),
  body("email").optional().isEmail().withMessage("Email không hợp lệ."),
  body("password")
    .optional()
    .isLength({ min: 6 }).withMessage("Mật khẩu phải ít nhất 6 ký tự."),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
router.use(authMiddleware);

router.post("/register", registerValidation, validate, ApiUserController.register);
router.post("/login", loginValidation, validate, ApiUserController.login);
router.post("/logout", ApiUserController.logout);
router.get("/", ApiUserController.index);
router.get("/:id", ApiUserController.show);
router.get("/current", ApiUserController.currentUser);
router.put("/update", updateValidation, validate, ApiUserController.update);
router.delete("/delete/:id", ApiUserController.delete);

module.exports = router;
