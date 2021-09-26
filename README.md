# BitSinger后端

## 设计思路

### 鉴权机制

由于是面向程序员的社交网站，所以在用户群体上要筛选出程序员，为此我们的鉴权方式如下：

登录时（后端已实现）

1. 通过调用github第三方登录拿到access_token和用户的信息
2. 根据1中的用户的id判断当前用户是否已经存在，若不存在则创建，将id作为存入数据库用户的coderID；
3. 若存在，则将用户对象用一个变量user保存下来
4. 根据用户id查找token，若token存在则更新token（保证一个用户只有一个token，同时更新有效期）；
5. 若不存在则创建token，将用户id和token一一对应起来
6. 向客户端浏览器返回token信息和用户信息

访问有权限的接口时（暂未实现）：

1. 通过请求头的token和用户id查找token，若不存在或过期则返回401

**Token表如下：**

| 字段名      | 类型             | 备注                                      |
| ----------- | ---------------- | ----------------------------------------- |
| _id         | ObjectId(String) | MongoDB自动生成的主键                     |
| token       | String           | 用户登录后拿到的github的access_token      |
| expires     | Date             | token过期时间                             |
| userID      | Number           | 用户的codeID                              |
| inBlacklist | Boolean          | 是否在token黑名单中(防止有些用户恶意攻击) |

**User表如下：**

| 字段名    | 类型             | 备注                  |
| --------- | ---------------- | --------------------- |
| _id       | ObjectId(String) | MongoDB自动生成的主键 |
| coderID   | Number           | Github的用户id        |
| username  | String           | Github用户名          |
| avatar    | String           | Github 用户头像URL    |
| githubURL | String           | Github首页地址        |
| fans      | Array            | 粉丝_id列表           |
| following | Array            | 关注用户_id列表       |

### 发动态机制

**Post表如下：**

| 字段名   | 类型             | 备注                  |
| -------- | ---------------- | --------------------- |
| _id      | ObjectId(String) | MongoDB自动生成的主键 |
| author   | String           | User的_id             |
| like     | Array            | 点赞用户的id列表      |
| content  | String           | 动态的文字部分        |
| code     | String           | 用户上传的代码        |
| img      | String           | 图片文件URL           |
| date     | Date             | 发布动态的日期        |
| comments | Array            | 评论_id列表           |

首先用户发布的内容可以是以下三种类型的组合：1. 图片 2.文字 3.代码 发布内容不能为空。

#### 存储图片的机制是：

1. 客户端浏览器通过表单上传
2. 服务端以流的形式将文件写入磁盘，并记录url存到img字段中

### 浏览动态机制

1. 首屏加载20条动态，关注的用户发的动态在前面，其他按发布时间排序。
2. 用户下拉到底部再向服务端发送请求加载新的20条动态
3. 用户可以对任意一条动态或动态的评论进行点赞或评论

#### 点赞/取消点赞的机制：

1. 将用户的id和文章的id发送到后端
2. 判断用户id是否在文章id对应的文章的like数组里
3. 若存在，则行为是取消点赞，将数组里该用户id删除
4. 若不存在，则行为是点赞，将用户id添加到该数组

### 评论机制

**Comment表如下：**

| 字段名  | 类型             | 备注                  |
| ------- | ---------------- | --------------------- |
| _id     | ObjectId(String) | MongoDB自动生成的主键 |
| from    | String           | 评论来源用户的_id     |
| to      | String           | 评论目标用户的_id     |
| postID  | String           | 动态_id               |
| content | String           | 评论内容              |
| date    | Date             | 评论日期              |
| like    | Array            | 点赞用户_id数组       |

设想的评论效果是仿微信朋友的评论效果（后端已实现）：

- 直接对文章评论时，将to字段设置为`null`，from表示评论来源的用户_id
- 对文章的评论评论时，将from字段设置为被评论的评论来源用户_id，from表示评论来源用户 _id，返回给前端时，根据时间排序

### 关注/取关机制

其思路跟点赞/取消点赞很相似，不过这个要更为复杂

1. 首先根据前端传来的`followerID`（订阅者ID）和`followingID`(发布者ID)来获取相应的用户
2. 若找不到相应的订阅者或发布者则返回400提示用户输入有误
3. 获取订阅者的`following`数组和发布者的`fans`数组
4. 判断发布者ID是否存在于订阅者的`following`数组里，若存在则删除之(取消订阅)；若不存在，则添加进数组中(订阅)
5. 判断订阅者ID是否存在于发布者的`fans`数组里，若存在删除之(取消订阅)；若不存在则添加进数组(订阅)
6. 根据`follwingID`和`followerID`更新发布者和订阅者的`fans`数组和`following`数组

