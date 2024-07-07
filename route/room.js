const room = require("express").Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const pool = require('../server');

// sample.jsから変数をインポートする
const db = require('../db');

room.get('/', (req,res) => {
  console.log('test');
});

module.exports = room;  // 外部から読み込むために
