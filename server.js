const express = require("express");
const mysql = require('mysql2/promise');
const bodyParser =require("body-parser");
const app = express();
const path = require('path');
const session = require('express-session');
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const router = require("./route/session.js");


app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // HTTPS使用時はtrueに設定
  }));

// ユーザープロフィール（認証が必要なルート）
app.get('/profile', (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ user: req.session.user });
  });
  
// 認証ミドルウェア
const requireAuth = (req, res, next) => {
if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
}
next();
};
  
// 認証が必要なルートの例
app.get('/protected', requireAuth, (req, res) => {
res.json({ message: 'This is a protected route', user: req.session.user });
});

// body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.render("./index.ejs",{ user: req.session.user });
});

app.get('/users', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM users');
      const users = rows.map(row => ({
        id: row.userid,
        username: row.username,
        password: row.password
      }));
      res.render('users', { users: users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('An error occurred while fetching users');
    }
});
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    // ここでユーザーIDを使用してデータベースからユーザー情報を取得
    // そして、ユーザー詳細ページをレンダリング
    //res.render('userDetail', { userId: userId });
    console.log(userId);
  });

app.use("/session", router);

io.on("connection", (socket) => {
  console.log("ユーザーが接続しました");
  socket.on("chat message", (msg) => {
    // console.log("massage:" + msg);
    io.emit("chat message", msg);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listenin on 3000");
});

app.use(express.json())

app.post('/', function (req, res) {
  console.log(req.body);
})


