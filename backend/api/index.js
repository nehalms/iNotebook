require('dotenv').config() 
const connectToMongo = require('../db')
const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors');

connectToMongo();
const app = express()
const port = process.env.PORT || 8080
const allowedOrigins = process.env.ORIGINS

let corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'auth-token', 'email', 'code']
};

app.use(cors(corsOptions))
app.use(cookieParser());
app.use(express.json())

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Access-Control-Allow-Origin, auth-token");
  next();
});

app.get("/test", (req, res) => {
 res.send("Hello");
});

//Available routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/notes', require('../routes/notes'));
app.use('/api/tasks', require('../routes/tasks'));
app.use('/api/getdata', require('../routes/data'));
app.use('/api/image', require('../routes/imagesController'));
app.use('/api/mail', require('../routes/EmailController'));
app.use('/api/game', require('../routes/game'));
app.use('/api/msg', require('../routes/message'));
app.use('/api/aes', require('../routes/AesEncryption'));

app.listen(port, () => {
  console.log(`iNotebook backend listening at port :${port}`)
});
