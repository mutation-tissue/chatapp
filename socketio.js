const socketIo = require('socket.io');
const db = require('./db');

function conenct_socketio(server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A user connected',socket.id);

        socket.on('sendMessage', (msg) => {
            console.log('Message received:', msg);
            io.emit('receiveMessage', msg);
        });
        // クライアントがルームに参加するイベントを受け取る
        socket.on('join room', (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined room ${room}`);
        });

        // ルーム内の全員にメッセージを送信するイベントを受け取る
        socket.on('room message', async(user_id,room_id, message) => {
            console.log("room sekected");
            console.log(user_id,room_id, message);

            try {

            await db.pool.execute(
                'INSERT INTO messages (room_id,user_id,message_text) VALUES (?,?,?)',
                [
                    room_id,
                    user_id,
                    message
                ]
            );

            const [send_user] = await db.pool.query(
                'SELECT username FROM users where user_id = ?',
                [
                    user_id
                ]
            );
            console.log(send_user[0]);
                //res.status(201).json({ message: 'User registered successfully' });
                io.to(room_id).emit('receiveMessage', user_id,send_user[0].username,message);
            } catch (error) {
                console.error(error);
            }
      
        });

        // クライアントが切断したときのイベント
        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
        });
});
}

module.exports = {conenct_socketio};
