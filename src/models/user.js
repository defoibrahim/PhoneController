const mongoos = require('mongoose')
const validator = require('validator')
const Task = require('./task')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoos.Schema({
    name:{
        type: String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
           if(!validator.isEmail(value)){
               throw new Error('invalid Email ')
           } 
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password is invalid..')
            }
        }
    },
    age:{
        type: Number,
        default:0,
        validate(value){
            if(value < 0)
            throw new Error('age must be a postive number')
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})



//generat token for each user
userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id:user._id.toString() },'thisistestproject')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}


userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner' 
});

// get profile data ( filtered )
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

//login function for find email - password match
userSchema.statics.findByCredentials = async (email , password) => {

    const user = await User.findOne({ email })
    if (!user) {
        throw 'Unable to login'
    }
    const isMash = await bcrypt.compare(password,user.password)
    if (!isMash) {
        throw 'Unable to login'
    }

    return user 

}

// hash the password befor save it
userSchema.pre('save',async function (next){
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
})

// delete tasks when user removed ( on casecade )
userSchema.pre('remove',async function (next){
    const user = this
    await Task.deleteMany({ owner:user._id })
    next()
})


const User = mongoos.model('User', userSchema)
module.exports = User