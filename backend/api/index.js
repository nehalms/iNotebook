require('dotenv').config() 
const connectToMongo = require('../db')
const express = require('express')
const cors = require('cors');

connectToMongo();
const app = express()
const port = process.env.PORT || 8080
 
let corsOptions = {
  origin: ['https://i-notebook-six-lovat.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'auth-token']
};

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
app.use('/api/msg', require('../routes/message'));
app.use('/api/aes', require('../routes/AesEncryption'));

app.listen(port, () => {
  console.log(`iNotebook backend listening at port :${port}`)
});
