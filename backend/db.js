const mongoose = require('mongoose');

// const mongoURI = "mongodb://127.0.0.1/inotebook" //inotebook is database name
const connectToMongo = ()=> {
    mongoose.connect(`mongodb+srv://${process.env.REACT_APP_MONGO_USERNAME}:${process.env.REACT_APP_MONGO_PASSWORD}@cluster0.ifjjiuu.mongodb.net/inotebook?retryWrites=true&w=majority&appName=Cluster0`).then(console.log("Connected to Mongodb"));
}

module.exports = connectToMongo;
