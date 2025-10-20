require('newrelic');
require('dotenv').config();
const connectToMongo = require('../db');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
// const morgan = require('morgan');
// const fs = require('fs');
// const path = require('path');

connectToMongo();
const app = express();
const port = process.env.PORT || 8080;
const allowedOrigins = process.env.ORIGINS;

let corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'auth-token', 'email', 'code']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// const logStream = fs.createWriteStream(path.join(__dirname, 'requests.log'), { flags: 'a' });
// app.use(morgan('common', { stream: logStream }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
  next(err);
});

app.get("/test", (req, res) => {
  res.send("Hello");
});

app.use('/api/auth', require('../routes/auth'));
app.use('/api/notes', require('../routes/notes'));
app.use('/api/tasks', require('../routes/tasks'));
app.use('/api/getdata', require('../routes/data'));
app.use('/api/image', require('../routes/imagesController'));
app.use('/api/mail', require('../routes/EmailController'));
app.use('/api/game', require('../routes/game'));
app.use('/api/msg', require('../routes/message'));
app.use('/api/aes', require('../routes/AesEncryption'));
app.use('/api/perm', require('../routes/permissionsController'));
app.use('/api/news', require('../routes/news'));
app.use('/api/calevents', require('../routes/calenderEvents'));
app.use('/api/heartbeat', require('../routes/liveUsers'));
app.use('/api/pin', require('../routes/securityPin'));

app.listen(port, () => {
  console.log(`iNotebook backend listening at port: ${port}`);
});
