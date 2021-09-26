const postService = require("../services/postService");

/**
 * PostController
 * Controller 是业务入口，由 HTTP 路由解析后调用
 * 包含待办事项的增删改查功能
 */
class PostController {
  /**
   * 查询author为userID下的所有post
   */
  async listAll(req, res) {
    const { author } = req.params;
    // 调用 Service 层对应的业务处理方法
    const list = await postService.listAll(author);
    res.send({
      retCode: 0,
      retMsg: '获取所有动态成功',
      data: list
    });
  }

  /**
   * 创建一条动态
   */
  async create(req, res) {
    const { author, content, code, img, date } = req.body;
    const like = [];
    const comments = [];
    // 调用 Service 层对应的业务处理方法
    const result = await commentService.create({ author, like, content, code, img, date, comments
      });
    res.send({
      retCode: 0,
      retMsg: '新增动态成功',
      data: result
    });
  }

  /**
   * 删除一条动态
   */
  async delete(req, res) {
    const { id, author } = req.params
    // 调用 Service 层对应的业务处理方法
    const result = await postService.delete( id, author );
    res.send({
      retCode: 0,
      retMsg: '删除动态成功',
      data: result
    });
  }


    /**
   * 创建一条评论后
   * 根据comment.postID, 在post的comment中添加评论id (postService)
   */
     async aftercomment(req, res) {
      const { postID, userID } = req.body
      // 调用 Service 层对应的业务处理方法
      await postService.aftercomment(postID, userID);
      res.send({
        retCode: 0,
        retMsg: '评论的人增加',
        data: {}
      });
    }
  
    /**
     * 创建一个点赞后
     * 给id为commentID的评论点赞, 往like数组中添加userID
     */
    async afterlike(req, res) {
      const { postID, userID } = req.body
      // 调用 Service 层对应的业务处理方法
      await postService.afterlike(postID, userID);
      res.send({
        retCode: 0,
        retMsg: '点赞的人增加',
        data: {}
      });
    }
  
    /**
     * 删除一条评论
     * todo: 根据postID, 在post的comment中删除评论id (postService)
     */
    async afteruncomment(req, res) {
      const { postID, userID } = req.body
      // 调用 Service 层对应的业务处理方法
      await postService.afteruncomment(postID, userID);
      res.send({
        retCode: 0,
        retMsg: '评论的人减少',
        data: {}
      });
    }
    /**
     * 删除点赞
     * 给id为commentID的评论取消点赞, 在like数组中删除userID
     */
      async afterunlike(req, res) {
      const { postID, userID } = req.body
      // 调用 Service 层对应的业务处理方法
      await postService.afterunlike(postID, userID);
      res.send({
        retCode: 0,
        retMsg: '点赞的人减少',
        data: {}
      });
    }

  }
// 导出 Controller 的实例
module.exports = new PostController();
