const userService = require("../services/userService");

/**
 * UserController
 * Controller 是业务入口，由 HTTP 路由解析后调用
 * 包含待办事项的增删改查功能
 */
class UserController {
  /**
   * 列出所有待办事项
   * 响应格式
   * {
   *   list: [user1, user2]
   * }
   * @param req Express 的请求参数
   * @param res Express 的响应参数
   */
  async listAll(req, res) {
    // 调用 Service 层对应的业务处理方法
    const list = await userService.listAll();
    res.send({ list });
  }

  /**
   * 创建一条待办事项
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
   * 删除一条待办事项
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

  /**
   * 删除所有待办事项
   * 响应格式
   * {
   *   ok: true
   * }
   * @param req Express 的请求参数
   * @param res Express 的响应参数
   */
  async deleteAll(req, res) {
    // 调用 Service 层对应的业务处理方法
    await userService.deleteAll();
    res.send({ ok: true });
  }

  /**
   * 将一条待办事项状态设为 done
   * 响应格式
   * {
   *   ok: true
   * }
   * @param req Express 的请求参数
   * @param res Express 的响应参数
   */
  async done(req, res) {
    // 调用 Service 层对应的业务处理方法
    await userService.update(req.params.id, { done: true });
    res.send({ ok: true });
  }

  /**
   * 将一条待办事项状态设为 undone
   * 响应格式
   * {
   *   ok: true
   * }
   * @param req Express 的请求参数
   * @param res Express 的响应参数
   */
  async undone(req, res) {
    // 调用 Service 层对应的业务处理方法
    await userService.update(req.params.id, { done: false });
    res.send({ ok: true });
  }
}

// 导出 Controller 的实例
module.exports = new UserController();
