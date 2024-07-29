const mongoose = require('mongoose');

// const mongoURI = "mongodb://127.0.0.1/inotebook" //inotebook is database name
const password = encodeURIComponent("nehal#02");
const connectToMongo = ()=> {
    mongoose.connect(`mongodb+srv://nehms1982:${password}@cluster0.ifjjiuu.mongodb.net/inotebook?retryWrites=true&w=majority&appName=Cluster0`).then(console.log("Connected to Mongodb"));
}


module.exports = connectToMongo;
