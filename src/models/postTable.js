// 使用 larkcloud 调用轻服务功能
const inspirecloud = require("@byteinspire/api");

// 使用轻服务 todo 表
// 若用户未创建，在发送第一条调用时会自动创建该表
const postTable = inspirecloud.db.table("Post");

// 导出 table 实例
module.exports = postTable;