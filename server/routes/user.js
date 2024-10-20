const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users_controller");
const authMiddleware = require("../middleware/auth");

router.get("/register", (req, res) => {
  res.render("users/register", { error: null });
});

router.get("/login", (req, res) => {
  res.render("users/login", { error: null });
});

router.post(
  "/register",
  UsersController.registerValidators,
  UsersController.register
);
router.post("/login", UsersController.loginValidators, UsersController.login);

router.use(authMiddleware);

router.get("/", UsersController.index);
router.get("/edit/:id", UsersController.edit);
router.post("/edit/:id", UsersController.update);
router.post("/delete/:id", UsersController.delete);
router.post("/logout", UsersController.logout);
router.post("/toggle-active/:id", UsersController.toggleActive);

module.exports = router;
