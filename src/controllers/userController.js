const userService = require("../services/userService");
const tokenService = require("../services/tokenService");
const axios = require("axios");
const qs = require("querystring");
const res = require("express/lib/response");

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

  async login(req, res) {
    //重定向到github登录
    const env = process.env;
    let path = "https://github.com/login/oauth/authorize";
    path += "?client_id=" + env.client_id;
    res.redirect(path);
  }

  async loginCallback(req, res) {
    //获取环境变量中的配置
    const env = process.env;
    const code = req.query.code;
    const params = {
      client_id: env.client_id,
      client_secret: env.client_secret,
      code: code,
    };
    let result = await axios.post(
      "https://github.com/login/oauth/access_token",
      params
    );
    // console.log(result.data);
    // res.send({ message: "登录成功", data: result.data });
    const token = qs.parse(result.data).access_token;
    try {
      result = await axios.get("https://api.github.com/user", {
        headers: {
          accept: "application/json",
          Authorization: `token ${token}`,
        },
      });
    } catch (err) {
      console.log(err.message);
      res.status(401).send({ message: "github身份认证出错！" });
      return;
    }
    const { login, id, avatar_url, html_url } = result.data;

    //根据codeID查找user，不存在就创建
    let user = await userService.findById(id);
    console.log(user);
    if (!user) {
      user = {
        coderID: id,
        username: login,
        avatar: avatar_url,
        githubURL: html_url,
        fans: [],
        following: [],
      };

      user = await userService.create(user);
    }
    let tokenObj = await tokenService.getToken(id);
    if (!tokenObj) {
      //创建token
      tokenObj = await tokenService.create(
        {
          token,
          userID: user.coderID,
          inBlacklist: false,
        },
        86400000
      );
    } else {
      tokenObj = await tokenService.updateToken(id, token);
    }

    res.send({ message: "登录成功", tokenObj, user });
  }

  async getUserById(req, res) {
    const coderID = req.params.codeID;
    const user = await userService.findById(coderID);
    if (!user) {
      res.status(400).send({ message: "无此用户" });
      return;
    }
    res.send({ message: "查找成功", data: user });
  }

  async follow(req, res) {
    //follwerID是订阅者id，followingID是发布者id
    const { followerID, followingID } = req.body;
    const subscriber = await userService.findById(followerID);
    const publisher = await userService.findById(followingID);
    if (!subscriber) {
      res.status(400).send({ message: "follower的id不正确" });
      return;
    }
    if (!publisher) {
      res.status(400).send({ message: "following的id不正确" });
      return;
    }
  }

  async unfollow(req, res) {}
}

// 导出 Controller 的实例
module.exports = new UserController();
