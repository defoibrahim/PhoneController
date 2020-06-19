const express = require('express')
require('../src/db/mongoose') // connect to db
const controller = require('../src/routers/controller')
const device = require('../src/routers/device')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(controller)
app.use(device)

app.listen(3000, () => {
    console.log('App listening on port '+ port);
});
