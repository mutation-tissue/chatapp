const db = require('../db');

const fetchDataFromDB = async (req, res, next) => {
    console.log(req.session.user);
    if(req.session.user){
        try {
            console.log("get db data");
            // データベースからデータを取得する処理
            const [user_join_room_id] = await db.pool.query(
                'SELECT room_id FROM user_room_memberships WHERE user_id = ?',
                [req.session.user.user_id]
            );
            console.log(user_join_room_id);
            // roomIds から room_id の値だけを抽出して新しい配列を作成する
            const roomIdsArray = user_join_room_id.map(item => item.room_id);
            console.log(roomIdsArray);


            const [room_names] = await db.pool.query(
                'SELECT * FROM chat_rooms WHERE room_id IN (?)',
                [roomIdsArray]
            );
            console.log(room_names);
            req.dataFromDB = room_names; // 取得したデータをリクエストオブジェクトに格納
            
            next(); // 次のミドルウェアまたはルートハンドラに制御を移す
        } catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).send('An error occurred while fetching data');
        }
    }
    next();
};


const get_messages = async (req, res, next) => {
    console.log(req.session.user);
    if(req.session.user){
        try {
            console.log("get db data",req.params.id);
            // データベースからデータを取得する処理
            const [message_texts] = await db.pool.query(
                'SELECT room_id,message_text FROM messages WHERE room_id = ?',
                [req.params.id]
            );
            req.messages = message_texts; // 取得したデータをリクエストオブジェクトに格納
            
            next(); // 次のミドルウェアまたはルートハンドラに制御を移す
        } catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).send('An error occurred while fetching data');
        }
    } else {
        next();
    }
};
module.exports = { fetchDataFromDB ,get_messages};