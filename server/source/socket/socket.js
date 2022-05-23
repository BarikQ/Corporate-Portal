import { User } from './../controllers';

export function setUpSocket(io) {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.broadcast.emit('VSEM KY', {
      id: socket.id,
      name: socket.userId,
    });

    socket.on('join', ({ id }) => {
      socket.join(id);
    });

    socket.on('private message', async ({ message, to }, callback) => {
      const user = await new User();
      const { senderMessage, receiverMessage } = await user.putChatMessage(
        socket.userId,
        to,
        message
      );
      console.log(senderMessage, receiverMessage);
      socket.to(to).emit('private message', {
        message: receiverMessage,
        from: socket.userId,
      });

      callback({ message: senderMessage });
    });
  });
}
