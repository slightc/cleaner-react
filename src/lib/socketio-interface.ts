import io from 'socket.io-client';

const socket = io('http://localhost:12374', {});

export default socket;