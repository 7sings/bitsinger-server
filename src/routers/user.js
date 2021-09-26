const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// Express 是通过 next(error) 来表达出错的，无法识别 async 函数抛出的错误
// wrap 函数的作用在于将 async 函数抛出的错误转换为 next(error)
function wrap(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}

// 组装路由

router.get("/all", wrap(userController.getAllUsers));
router.get("/find/:id", wrap(userController.getUserById));
router.delete("/:id", wrap(userController.delete));
router.get("/login", wrap(userController.login));
router.get("/login/callback", wrap(userController.loginCallback));

module.exports = router;
