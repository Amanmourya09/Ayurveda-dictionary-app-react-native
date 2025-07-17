const mongoose = require('mongoose')

const langSchema = new mongoose.Schema({
    क्रमांक:{
        type:String,
        required:true
    },
    पद:{
        type:String,
    },
    लिंग:{
        type:String,
    },
    व्याख्या:{
        type:String
    },
    सन्दर्भ:{
        type:String
    },
    मराठी_अर्थ:{
        type:String
    }
})

module.exports = mongoose.model("Lang" , langSchema)