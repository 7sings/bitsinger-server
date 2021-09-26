const postTable = require("../models/postTable");
const commentTable = require("../models/commentTable");
const userTable = require("../models/userTable");
const inspirecloud = require("@byteinspire/api");
const ObjectId = inspirecloud.db.ObjectId;

/**
 * PostService
 * Service 是业务具体实现，由 Controller 或其它 Service 调用
 * 包含待办事项的增删改查功能
 */
class PostService {
  /**
   * 查询所有动态信息
   */
  async listAll() {
    const all = await postTable.where().find();
    return all;
  }

  /**
   * 在个人主页页面查看已发布的动态信息
   */
  async listAllByAuthor(author) {
    const all = await postTable.where({ author }).find();
    return all;
  }

  /**
   * 创建一条新的动态信息
   */
  async create(post) {
    return await postTable.save(post);
  }

  /**
   * 删除已发布的动态信息
   */
  async delete(id) {
    const result = await postTable.where({ _id: ObjectId(id) }).delete();
    if (result.deletedCount === 0) {
      const error = new Error(`user:${id} not found`);
      error.status = 404;
      throw error;
    }
  }

  /**
   * 点赞post
   * 往like数组中添加userID
   */
  async like(postID, userID) {
    const result = await postTable.where({ _id: ObjectId(postID) }).findOne();
    result.like.push(userID)
    await commentTable.save(result)
  }

  /**
   * 删除点赞
   * 给id为commentID的评论取消点赞, 在like数组中删除userID
   */
  async unlike(postID, userID) {
    const result = await postTable.where({ _id: ObjectId(postID) }).findOne();
    result.like.splice(result.like.indexOf(userID), 1)
    await postTable.save(result)
  }

  /**
   * 创建一条评论后
   * 根据comment.postID, 在post的comment中添加评论id (postService)
   */
  // async aftercomment(postID, userID) {
  //   const result = await postTable.where({ _id: ObjectId(postID) }).findOne();
  //   result.comments.push(userID)
  //   await postTable.save(result)
  // }



  /**
   * 删除一条评论
   * todo: 根据postID, 在post的comment中删除评论id (postService)
   */
  // async afteruncomment(postID, userID) {
  //   const result = await postTable.where({ _id: ObjectId(postID) }).findOne();
  //   result.comments.splice(result.like.indexOf(userID), 1)
  //   await postTable.save(result)
  // }

}

// 导出 Service 的实例
module.exports = new PostService();
