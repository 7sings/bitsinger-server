const commentTable = require("../models/commentTable");
const userTable = require("../models/userTable");
const inspirecloud = require("@byteinspire/api");
const ObjectId = inspirecloud.db.ObjectId;

/**
 * CommentService
 * Service 是业务具体实现，由 Controller 或其它 Service 调用
 * 包含待办事项的增删改查功能
 */
class CommentService {
  /**
   * 列出所有评论
   */
  async listAll(postID) {
    const all = await commentTable.where({ postID }).find();
    // 遍历all, 根据from和to, 查询用户数据 (userService)
    // const promises = all.map(async item => {
    //   const user = await userTable.where({ _id: ObjectId(item.from)}).findOne();
    //   item.fromInfo = user;
    // });
    // const promises2 = all.map(async item => {
    //   const user = await userTable.where({ _id: ObjectId(item.to)}).findOne();
    //   item.toInfo = user;
    // });
    // await Promise.all([...promises, ...promises2])
    return all;
  }

  /**
   * 根据commentID查询单条评论
   */
  async findOne(id) {
    const result = await commentTable.where({ _id: ObjectId(id) }).findOne();
    // 根据from和to, 查询用户数据 (userService)
    // result.fromInfo = await userTable.where({ _id: ObjectId(result.from)}).findOne();
    // result.toInfo = await userTable.where({ _id: ObjectId(result.from)}).findOne();
    return result;
  }

  /**
   * 创建一条评论
   */
  async create(comment) {
    // todo: 根据comment.postID, 在post的comment中添加评论id (postService)
    return await commentTable.save(comment);
  }

  /**
   * 删除一条评论
   */
  async delete(id, postID) {
    const result = await commentTable.where({ _id: ObjectId(id) }).delete();
    if (result.deletedCount === 0) {
      const error = new Error(`user:${id} not found`);
      error.status = 404;
      throw error;
    }
    // todo: 根据postID, 在post的comment中删除评论id (postService)
  }

  /**
   * 给id为commentID的评论点赞, 往like数组中添加userID
   */
  async like(commentID, userID) {
    const result = await commentTable.where({ _id: ObjectId(commentID) }).findOne();
    result.like.push(userID)
    await commentTable.save(result)
  }

  /**
   * 给id为commentID的评论取消点赞, 在like数组中删除userID
   */
  async unlike(commentID, userID) {
    const result = await commentTable.where({ _id: ObjectId(commentID) }).findOne();
    result.like.splice(result.like.indexOf(userID), 1)
    await commentTable.save(result)
  }
}

// 导出 Service 的实例
module.exports = new CommentService();
