const socketIo = require('socket.io');

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
        socket.on('room message', (room, message) => {
            console.log("room sekected");
            console.log(room, message);
            io.to(room).emit('receiveMessage', message);
        });

        // クライアントが切断したときのイベント
        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
        });
});
}

module.exports = {conenct_socketio};
