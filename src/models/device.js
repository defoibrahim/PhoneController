const mongoos = require('mongoose')
const validator = require('validator')
const deviceSchema = new mongoos.Schema({
    name:{
        type: String,
        trim:true,
        required:true
    },
    color:{
        type: String,
        required:true
        
    }, 
    imei:{
        type: Number,
        required:true
    }, 
    type:{// samsung - etc
        type: String,
        trim:true,
        required:true
    },
    owner:{
        type: mongoos.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})

deviceSchema.pre('save', async function (next){

    next()
})

const Device = mongoos.model('Device',deviceSchema )
module.exports = Device