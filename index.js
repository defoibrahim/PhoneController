const express = require('express')
const controller = require('./src/routers/controller')

require('./src/db/mongoose') // connect to db
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(controller)

app.listen(3000, () => {
    console.log('App listening on port '+ port);
});