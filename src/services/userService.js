const userTable = require("../models/userTable");

/**
 * UserService
 * Service 是业务具体实现，由 Controller 或其它 Service 调用
 * 包含用户的增删改查功能
 */
class UserService {
  /**
   * 查找所有用户
   * @return {Promise<Array<any>>} 返回用户数组
   */
  async getAllUsers() {
    const users = await userTable.where().find();
    return users;
  }

  /**
   * 创建一个新用户
   * @param user 用于创建用户的数据，原样存进数据库
   * @return {Promise<any>} 返回实际插入数据库的数据，会增加_id，createdAt和updatedAt字段
   */
  async create(user) {
    return await userTable.save(user);
  }

  /**
   * 删除一名用户
   * @param coderID 用户 coderID
   * 若不存在，则抛出 404 错误
   */
  async delete(coderID) {
    const result = await userTable.where({ coderID }).delete();
    if (result.deletedCount === 0) {
      const error = new Error(`user:${coderID} not found`);
      error.status = 404;
      throw error;
    }
  }

  /**
   * 更新一名用户
   * @param coderID 用户的 coderID
   * @param updater 将会用原对象 merge 此对象进行更新
   * 若不存在，则抛出 404 错误
   */
  async update(coderID, updater) {
    const user = await userTable.where({ coderID }).findOne();
    console.log(user);
    if (!user) {
      const error = new Error(`user:${coderID} not found`);
      error.status = 404;
      throw error;
    }
    Object.assign(user, updater);
    await userTable.save(user);
  }

  /**
   * @description 根据codeID查找用户
   * @param {number} coderID 用户的github接口返回的id
   * @returns {object} 返回user
   */
  async findById(coderID) {
    const user = await userTable.where({ coderID }).findOne();

    return user;
  }
}

// 导出 Service 的实例
module.exports = new UserService();
