const expres = require("express");
const router = expres.Router();
const axios = require("axios");
const qs = require("querystring");

const config = {
  client_id: "7e428bb1271a32ee9bbf",
  client_secret: "61d732a6e7d07d309f3fb00d3539acd6f01ba354",
};

router.get("/", (req, res) => {
  const dateStr = new Date().valueOf();
  const path = "https://github.com/login/oauth/authorize";
  path += "?client_id=" + config.client_id;
  res.redirect(path);
});

router.get("/callback", async (req, res) => {
  console.log("callback...", req.url);
  const code = req.query.code;
  const params = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: code,
  };
  let result = await axios.post(
    "https://github.com/login/oauth/access_token",
    params
  );
  res.send({ message: "登录成功", data: result.data });
  const token = qs.parse(res.data).access_token;
  result = await axios.get("https://api.github.com/user", {
    headers: {
      accept: "application/json",
      Authorization: `token ${token}`,
    },
  });
  res.send({ message: "获取到用户信息", data: result.data });
  res.send(`
    <h1>hello ${result.data.login}</h1>
    <img src="${result.data.avatar_url}" />
    `);
});
