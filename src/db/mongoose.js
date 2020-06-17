const mongoos = require('mongoose')

mongoos.connect('mongodb://127.0.0.1:27017/phone_controller_api',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
})