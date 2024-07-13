const db = require('../db');

const is_user_login =  (req, res, next) => {
    if (req.session && req.session.user) {
        next();  // セッションが存在する場合は次のミドルウェアまたはルートハンドラに進む
    } else {
        res.redirect('/session/login');  // セッションが存在しない場合はログインページにリダイレクト
    }
}

const fetchDataFromDB = async (req, res, next) => {
    console.log(req.session.user);
    try {
        if(req.session.user){
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
        }
            next(); // 次のミドルウェアまたはルートハンドラに制御を移す
        } catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).send('An error occurred while fetching data');
        }
};
const is_there_room = async (req, res, next) => {
    try {
    
        // データベースからデータを取得する処理
        const [room_id] = await db.pool.query(
            'SELECT room_id FROM chat_rooms WHERE room_id = ?',
            [req.params.id]
        );
        console.log(room_id);
        if (room_id.length === 0) {
            //return res.status(401).json({ message: 'Invalid username or password' });
            req.flash('error', '部屋が見つかりませんでした。');
            console.log("部屋が見つかりません")
            return res.redirect('./');
        }
    } catch (error) {
        console.error('Error fetching data from database:', error);
        res.status(500).send('An error occurred while fetching data');
    }
    next(); // 次のミドルウェアまたはルートハンドラに制御を移す
};

const get_messages = async (req, res, next) => {
    console.log(req.session.user);
    if(req.session.user){
        try {
            console.log("get db data",req.params.id);
            // データベースからデータを取得する処理
            const query = `
                SELECT users.username,messages.message_text, messages.user_id FROM users
                inner JOIN messages ON messages.user_id = users.user_id where room_id = ?;
            `;
            const [message_texts] = await db.pool.query(
                query,
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
module.exports = { fetchDataFromDB ,get_messages,is_user_login,is_there_room};