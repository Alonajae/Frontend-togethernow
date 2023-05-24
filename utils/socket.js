import {io} from 'socket.io-client';

const socket=io.connect('https://backend-together-mvp.vercel.app');

export default socket;