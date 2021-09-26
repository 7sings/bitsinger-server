const commentService = require("../services/commentService");

/**
 * CommentController
 * Controller 是业务入口，由 HTTP 路由解析后调用
 * 包含待办事项的增删改查功能
 */
class CommentController {
  /**
   * 查询id为postID动态下的所有评论条目
   */
  async listAll(req, res) {
    const { postID } = req.params;
    // 调用 Service 层对应的业务处理方法
    const list = await commentService.listAll(postID);
    res.send({
      retCode: 0,
      retMsg: '获取所有评论成功',
      data: list
    });
  }

  /**
   * 根据commentID查询单条评论
   */
  async findOne(req, res) {
    const { id } = req.params
    // 调用 Service 层对应的业务处理方法
    const result = await commentService.findOne(id);
    res.send({
      retCode: 0,
      retMsg: '获取单条评论成功',
      data: result
    });
  }

  /**
   * 创建一条评论
   */
  async create(req, res) {
    const { from, to = '', postID, content, date  } = req.body;
    const like = [];
    // 调用 Service 层对应的业务处理方法
    const result = await commentService.create({ from, to, postID, content, date, like });
    res.send({
      retCode: 0,
      retMsg: '新增评论成功',
      data: result
    });
  }

  /**
   * 删除一条评论
   */
  async delete(req, res) {
    const { id, postID } = req.params
    // 调用 Service 层对应的业务处理方法
    const result = await commentService.delete(id, postID);
    res.send({
      retCode: 0,
      retMsg: '删除评论成功',
      data: result
    });
  }

  /**
   * 给id为commentID的评论点赞, 往like数组中添加userID
   */
  async like(req, res) {
    const { commentID, userID } = req.body
    // 调用 Service 层对应的业务处理方法
    await commentService.like(commentID, userID);
    res.send({
      retCode: 0,
      retMsg: '点赞成功',
      data: {}
    });
  }

  /**
   * 给id为commentID的评论点赞, 在like数组中删除userID
   */
  async unlike(req, res) {
    const { commentID, userID } = req.query
    // 调用 Service 层对应的业务处理方法
    await commentService.unlike(commentID, userID);
    res.send({
      retCode: 0,
      retMsg: '取消点赞成功',
      data: {}
    });
  }
}

// 导出 Controller 的实例
module.exports = new CommentController();
