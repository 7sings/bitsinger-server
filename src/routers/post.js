const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

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
router.post("/like", wrap(postController.like));
router.delete("/like", wrap(postController.unlike));

router.get("/list", wrap(postController.listAll));
// router.get("/:id", wrap(postController.findOne));
router.post("/", wrap(postController.create));
router.delete("/:id", wrap(postController.delete));


module.exports = router;
