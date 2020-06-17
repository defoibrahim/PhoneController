const mongoos = require('mongoose')
const validator = require('validator')
const taskSchema = new mongoos.Schema({
    desc:{
        type: String,
        trim:true,
        required:true
    },
    complated:{
        type: Boolean,
        default:false
    }, 
    owner:{
        type: mongoos.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})

taskSchema.pre('save', async function (next){

   
    next()
})

const Task = mongoos.model('Task',taskSchema )
module.exports = Task