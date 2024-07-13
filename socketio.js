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
        
                //res.status(201).json({ message: 'User registered successfully' });
            } catch (error) {
                console.error(error);
            }
      
            io.to(room_id).emit('receiveMessage', user_id,message);
        });

        // クライアントが切断したときのイベント
        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
        });
});
}

module.exports = {conenct_socketio};
