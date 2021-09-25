const userService = require("../services/userService");

/**
 * UserController
 * Controller 是业务入口，由 HTTP 路由解析后调用
 * 包含用户的增删改查功能
 */
class UserController {
  /**
   * 返回所有用户
   * 响应格式
   * {
   *   users: [user1, user2]
   * }
   * @param req Express 的请求参数
   * @param res Express 的响应参数
   */
  async listAll(req, res) {
    // 调用 Service 层对应的业务处理方法
    const users = await userService.listAll();
    res.send({ users });
  }

  /**
   * 创建一个新用户
   * 响应格式
   * {
   *   result: newUser
   * }
   * @param req Express 的请求参数
   * @param res Express 的响应参数
   */
  async create(req, res) {
    const { title, done = false } = req.body;
    // 调用 Service 层对应的业务处理方法
    const result = await userService.create({ title, done });
    res.send({ result });
  }

  /**
   * 删除一个用户
   * 响应格式
   * {
   *   ok: true
   * }
   * @param req Express 的请求参数
   * @param res Express 的响应参数
   */
  async delete(req, res) {
    // 调用 Service 层对应的业务处理方法
    await userService.delete(req.params.id);
    res.send({ ok: true });
  }
}

// 导出 Controller 的实例
module.exports = new UserController();
