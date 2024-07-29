const mongoose = require('mongoose');

// const mongoURI = "mongodb://127.0.0.1/inotebook" //inotebook is database name
const connectToMongo = ()=> {
    mongoose.connect(process.env.REACT_APP_MONGO_URL).then(console.log("Connected to Mongodb"));
}

module.exports = connectToMongo;