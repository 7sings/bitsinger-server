const tokenTable = require("../models/tokenTable");
const inspirecloud = require("@byteinspire/api");
const ObjectId = inspirecloud.db.ObjectId;

class TokenService {
  /**
   * @description 检查token是否有效
   * @param {number} userID 用户的codeID
   * @param {string} access_token 登录后从github拿到的access_token
   * @returns {Promise<Boolean>} 返回
   */
  async chekcToken(userID, access_token) {
    //判断该token是否存在
    const token = await tokenTable
      .where({ userID, token: access_token })
      .findOne();
    if (!token) return false;
    //判断token是否过期
    const expires = token.expires;
    if (expires < Date.now()) return false;

    return true;
  }

  /**
   * @description 创建token并存入数据库
   * @param {object} token token实例对象
   * @param {number} maxAge 有效时间：ms
   * @returns {object} 返回创建的token
   */
  async create(token, maxAge) {
    Object.assign(token, { expires: new Date(Date.now() + maxAge) });
    return await tokenTable.save(token);
  }

  /**
   * @description 根据用户id拿到token
   * @param {numebr} userID
   * @returns {object} 返回token对象
   */
  async getToken(userID) {
    const tokenObj = await tokenTable.where({ userID }).findOne();
    return tokenObj;
  }

  /**
   * @description 同一个用户登录更新token
   * @param {number} userID
   * @param {string} token
   * @returns {object} 返回更新后的token，如果找不到返回null
   */
  async updateToken(userID, token) {
    const tokenObj = await this.getToken(userID);
    if (tokenObj) {
      Object.assign(tokenObj, {
        token: token,
        expires: new Date(Date.now() + 86400000),
      });
      return await tokenTable.save(tokenObj);
    }
    return null;
  }
}

module.exports = new TokenService();
