require('dotenv').config() 
const connectToMongo = require('../db')
const express = require('express')
const cors = require('cors')
const http = require("http");
const socketIO = require("socket.io");

connectToMongo();
const app = express()
const port = process.env.PORT || 8080
const server = http.createServer(app);
 
let corsOptions = {
  origin: ['https://i-notebook-six-lovat.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'auth-token']
};
const io = socketIO(server, {
  cors: corsOptions,
});

app.use(cors())
app.use(express.json())

app.get("/test", (req, res) => {
 res.send("Hello");
});

//Available routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/notes', require('../routes/notes'));
app.use('/api/getdata', require('../routes/data'));
app.use('/api/image', require('../routes/imagesController'));
app.use('/api/mail', require('../routes/EmailController'));
app.use('/api/game', require('../routes/game'));

let ticRooms = {};

io.on("connection", (socket) => {

  console.log("User connected :", socket.id);

  socket.on('joinRoom', (data) => {
    let roomID = data.id;
    if (ticRooms[roomID] && ticRooms[roomID].players.length >= 2) {
      io.to(socket.id).emit("msg", "room is full");
      return;
    }
    
    if (!ticRooms[roomID]) {
      ticRooms[roomID] = {
        players: [],
        board: Array(9).fill(null),
        currTurn: '',
        userInfo: [],
      };
    }
    if(ticRooms[roomID].players.includes(socket.id)) {
      io.to(socket.id).emit("msg", 'Already in room');
      return;
    }
    socket.join(roomID);  
    console.log(`Socket ${socket.id} joined room ${roomID}`);
    ticRooms[roomID].players.push(socket.id);
    ticRooms[roomID].userInfo.push({name: data.name, played: data.played});
    console.log(ticRooms);

    if (ticRooms[roomID].players.length === 2) {
      let roomDetails = {
        player: 'O',
        id: roomID,
        board: ticRooms[roomID].board,
        currTurn: ticRooms[roomID].currTurn,
      }
      io.to(socket.id).emit('playerName', roomDetails);
      let playersList = ticRooms[roomID].players;
      let users = ticRooms[roomID].userInfo;
      io.to(playersList[0]).emit('opponent', users[1]);
      io.to(playersList[0]).emit('msg', `Connected to player ${users[1].name}`);
      io.to(playersList[1]).emit('opponent', users[0]);
      io.to(playersList[1]).emit('msg', `Connected to player ${users[0].name}`);
    } else {
      let roomDetails = {
        player: 'X',
        id: roomID,
      }
      io.to(socket.id).emit('playerName', roomDetails);
    }
  });

  socket.on("makeMove", (data) => {
    if(!ticRooms[data.id]) {
      return;
    }
    ticRooms[data.id].board = data.board;
    ticRooms[data.id].currTurn = data.currTurn;
    io.to(data.id).emit("moveMade", data);
  });

  socket.on("gameOver", (data) => {
    let idx = ticRooms[data.id].players.indexOf(socket.id);
    idx = idx == 1 ? 0 : 1;
    io.to(ticRooms[data.id].players[idx]).emit("gameOver", data);
  });

  socket.on("resetGame", (data) => {
    io.to(data.id).emit("gameReset", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected :", socket.id);
  });
});

server.listen(port, () => {
  console.log(`iNotebook backend listening at port :${port}`)
});
