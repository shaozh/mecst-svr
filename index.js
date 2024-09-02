const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Counter } = require("./db");

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

app.get("/api/ecst-kp-article", async (req, res) => {
  const result = [
    { "_id": "001", "author": "北大六院", "num": 88, "type": 1, "title": "认识儿童注意缺陷/多动障碍", "create_date": "2024-09-01", "icon": "https://env-00jxh1h3qwke.normal.cloudstatic.cn/imgs/640.jpg", "url": "https://mp.weixin.qq.com/s/YfhIYbovVY1LbenVLTJDaQ" },
    { "_id": "66d3f277817f4bca2f358aea", "author": "中华医学会", "num": 105, "type": 1, "title": "如何预防老年痴呆？", "create_date": "2024-09-01", "icon": "https://www.cma.org.cn/picture/0/3ac36ecaad294eceb5a0c5e90fae2058.jpg", "url": "https://www.cma.org.cn/art/2022/8/9/art_4584_46979.html" },
    { "_id": "66d3f369117ca90227d6edd3", "author": "中华医学会", "icon": "https://www.cma.org.cn/picture/0/a55f7433e69c4087a516953a4f837fef.jpg", "num": 100, "type": 1, "create_date": "2024-09-01", "title": "如何预防老年人坠床？", "url": "https://www.cma.org.cn/art/2022/6/9/art_4584_45376.html" },
    { "_id": "66d3f3a2817f4bca2f358c1f", "author": "中华医学会", "icon": "https://www.cma.org.cn/picture/0/26b21b02043d43e4b8d81314dad7da21.jpg", "type": 1, "num": 99, "title": "老年人如何避免误吸？", "create_date": "2024-09-01", "url": "https://www.cma.org.cn/art/2022/6/9/art_4584_45358.html" },
    { "_id": "66d4043248462dac6a595f46", "author": "北大六院", "create_date": "2024-09-01", "icon": "https://www.pkuh6.cn/Sites/Uploaded/UserUpLoad/20230922/20230922112857.jpg", "num": 101, "title": "老年痴呆防治促进行动宣传视频", "type": 2, "url": "https://www.pkuh6.cn/Sites/Uploaded/File/2023/09/226383097881643315374809887.mp4" },
    { "_id": "66d4046c988f93d70b714495", "author": "北大六院", "create_date": "2024-09-01", "icon": "https://www.pkuh6.cn/Sites/Uploaded/UserUpLoad/20201022/20201022104028.jpg", "num": 100, "title": "焦虑情绪的心理调适", "type": 2, "url": "https://www.pkuh6.cn//Sites/Uploaded/File/2020/10/226373895984668402194330981.mp4" },
    { "_id": "66d41146154ef38d39f0b38d", "author": "北大六院", "create_date": "2024-09-01", "icon": "https://www.pkuh6.cn/Sites/Uploaded/UserUpLoad/20201022/20201022103952.jpg", "num": 99, "title": "提升认知障碍老年人的幸福感", "type": 2, "url": "https://www.pkuh6.cn/Sites/Uploaded/File/2020/10/226373896001004381034006296.mp4" },
  ];
  res.send({
    code: 0,
    data: result,
  });
});


const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
