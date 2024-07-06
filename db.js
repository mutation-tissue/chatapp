const express = require("express");
const mysql = require('mysql2/promise');
const bodyParser =require("body-parser");
const app = express();
const path = require('path');

// データベース接続設定
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'ropassot',
    database: 'test'
  };
  
// データベース接続とテーブル作成を行う関数
async function initializeDatabase() {
try {
    // データベースに接続
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the database.');

    // テーブルを作成
    await connection.execute(`CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // テーブルを作成
    await connection.execute(`CREATE TABLE IF NOT EXISTS chat_rooms (
      room_id INT AUTO_INCREMENT PRIMARY KEY,
      room_name VARCHAR(100) NOT NULL,
      description TEXT,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
    )`);

    // テーブルを作成
    await connection.execute(`CREATE TABLE IF NOT EXISTS messages (
      message_id INT AUTO_INCREMENT PRIMARY KEY,
      room_id INT,
      user_id INT,
      message_text TEXT NOT NULL,
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES chat_rooms(room_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`);

    // テーブルを作成
    await connection.execute(`CREATE TABLE IF NOT EXISTS user_room_memberships (
      membership_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      room_id INT,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (room_id) REFERENCES chat_rooms(room_id),
      UNIQUE KEY (user_id, room_id)
    )`);

    // 接続を閉じる
    await connection.end();
} catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
}
}

  
// サーバー起動時にデータベースを初期化
initializeDatabase().then(() => {
    console.log("初期化されました")
});

// データベース接続プールの作成（アプリケーション全体で使用）
const pool = mysql.createPool(dbConfig);

module.exports = {
  pool
};