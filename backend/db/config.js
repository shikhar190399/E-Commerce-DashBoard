const mongoose= require('mongoose')
mongoose.connect(process.env.MONGO_URI, console.log("MongoDb connected"))
