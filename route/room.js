const room = require("express").Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const pool = require('../server');
const { fetchDataFromDB } = require('../middleware/session_user');
// sample.jsから変数をインポートする
const db = require('../db');

room.get('/', (req,res) => {
  console.log('test');
});

room.get('/create', (req,res) => {
    res.render('./create_room.ejs');
});

room.post('/create',async (req, res)=> {
    try {

        //この書き方は分割代入法という短縮形
        const { roomname, member } = req.body;
        console.log(req.body);

        await db.pool.execute(
          'INSERT INTO chat_rooms (room_name) VALUES (?)',
          [roomname]
        );
        const [result] = await db.pool.execute(
            'SELECT * FROM chat_rooms WHERE room_name = ?',
            [roomname]
          );
        console.log(req.session.user);
        console.log(result[0].room_id)

        await db.pool.execute(
            'INSERT INTO user_room_memberships (user_id,room_id) VALUES (?,?)',
            [req.session.user.user_id, result[0].room_id]
          );
        
        const [selected_user] = await db.pool.execute(
        'SELECT user_id FROM users WHERE username = ?',
            [member]
        );
        await db.pool.execute(
        'INSERT INTO user_room_memberships (user_id,room_id) VALUES (?,?)',
        [selected_user[0].user_id, result[0].room_id]
        );
    
        //res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
      }

      res.render("./index.ejs", {user: req.session.user.userid})
    });

module.exports = room;  // 外部から読み込むために
