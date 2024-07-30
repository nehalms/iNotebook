require('dotenv').config() 
const connectToMongo = require('../db')
const express = require('express')
const cors = require('cors')
 
connectToMongo();
const app = express()
const port = process.env.REACT_APP_PORT || 8080
 
let corsOptions = {
  origin: ["http://localhost:3000"],
};

app.use(cors(corsOptions))
app.use(express.json())

app.get("/", (res, req) => {
 res.send("Hello");
});

//Available routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/notes', require('../routes/notes'));

app.listen(port, () => {
  console.log(`iNotebook backend listening at port :${port}`)
})
