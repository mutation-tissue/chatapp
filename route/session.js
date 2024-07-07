const router = require("express").Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const pool = require('../server');
const { fetchDataFromDB } = require('../middleware/session_user');
// sample.jsから変数をインポートする
const db = require('../db');

router.get('/', (req,res) => {
  res.render("./index.ejs",{ user: req.session.user });
});

router.post('/adduser',async (req, res)=> {
    try {

        //この書き方は分割代入法という短縮形
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const [result] = await db.pool.execute(
          'INSERT INTO users (username, password) VALUES (?, ?)',
          [username, hashedPassword]
        );
    
        //res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
      }

      res.render("./mainmenu.ejs")
    });

// ログイン

router.get("/login", (req, res) => {
  console.log(db.pool);
  res.render("./login.ejs")
});

router.post('/login', async (req, res) => {
    try {
    const { username, password } = req.body;

    const [rows] = await db.pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );

    if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // セッションにユーザー情報を保存
    req.session.user = {
        user_id: user.user_id,
        username: user.username
      };
    //req.session.userId = user.id;
    //res.json({ message: 'Logged in successfully' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
    }
    res.redirect('../');
});

// ログアウト
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
    if (err) {
        return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
    });
});

router.get("/create-account", (req, res) => {
    res.render("./create_account.ejs")
  });
  
module.exports = router;  // 外部から読み込むために
