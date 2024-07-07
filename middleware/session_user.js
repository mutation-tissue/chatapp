const db = require('../db');

const fetchDataFromDB = async (req, res, next) => {
    console.log(req.session.user);
    if(req.session.user){
        try {
            // データベースからデータを取得する処理
            //const [rows] = await db.pool.query('SELECT * FROM your_table');
            //req.dataFromDB = rows; // 取得したデータをリクエストオブジェクトに格納
            console.log("get db data");
            next(); // 次のミドルウェアまたはルートハンドラに制御を移す
        } catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).send('An error occurred while fetching data');
        }
    }
    next();
};

module.exports = { fetchDataFromDB };