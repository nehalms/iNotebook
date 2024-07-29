//to run - nodemon ./index.js in cmd
require('dotenv').config() 
const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
 
connectToMongo();
const app = express()
const port = process.env.REACT_APP_PORT
 
// console.log(process.env.REACT_APP_PORT)  
// console.log(process.env.REACT_APP_MONGO_URL)  

app.use(cors())
app.use(express.json())

//Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNotebook backend listening at port :${port}`)
})