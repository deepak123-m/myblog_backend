const mongoose = require('mongoose');

const mongoURL = "mongodb+srv://deepak79935:Deep79935@cluster0.ck5rh1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


const connectToMongo = () => {
    mongoose.connect(mongoURL).then(()=>console.log("Connected")).catch((e)=>console.log(e.message))
    } 



module.exports = connectToMongo;

