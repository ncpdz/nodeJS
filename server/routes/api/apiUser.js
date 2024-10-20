const express = require("express");
const router = express.Router();
const ApiUserController = require("../../controllers/api/user_controller");
const { body } = require("express-validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

const registerValidation = [
  body("username")
    .notEmpty()
    .withMessage("Tên đăng nhập là bắt buộc.")
    .isLength({ min: 3 })
    .withMessage("Tên đăng nhập phải ít nhất 3 ký tự."),
  body("email").isEmail().withMessage("Email không hợp lệ."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải ít nhất 6 ký tự."),
];

const loginValidation = [
  body("username").notEmpty().withMessage("Tên đăng nhập là bắt buộc."),
  body("password").notEmpty().withMessage("Mật khẩu là bắt buộc."),
];

const updateValidation = [
  body("username")
    .optional()
    .notEmpty()
    .withMessage("Tên đăng nhập không được để trống.")
    .isLength({ min: 3 })
    .withMessage("Tên đăng nhập phải ít nhất 3 ký tự."),
  body("email").optional().isEmail().withMessage("Email không hợp lệ."),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải ít nhất 6 ký tự."),
];

router.post("/register", registerValidation, ApiUserController.register);
router.post("/login", loginValidation, ApiUserController.login);
router.post("/logout", ApiUserController.logout);
router.get("/", authenticate, ApiUserController.getAllUsers);
router.put("/update", authenticate, updateValidation, ApiUserController.update);
router.delete(
  "/delete/:id",
  authenticate,
  authorize("admin"),
  ApiUserController.delete
);

module.exports = router;
