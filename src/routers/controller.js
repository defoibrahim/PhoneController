const User = require('../models/user') 
const auth = require('../middleware/auth')
const express = require('express')
const router = new express.Router
const jwt = require('jsonwebtoken') 



// add new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send(user.name +' created successfully! ' + token);
    } catch (err) {
        res.status(400).send('error '+err);
    }
});

//user login
router.post('/users/login', async(req, res) => {
    try {
        console.log('login route');
        
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token});
 
    } catch (err) {
        res.status(500).send({error:err , code:500,msg:"Unable to login"}) 
    }
});

// logout 
router.post('/users/logout', auth, async (req, res) => {
    try {
       
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send();
        
    } catch (err) {
        res.status(500).send()
    }
    
});

//get user by id
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send('user not found')
        }
        res.send(user);
    } catch (err) {
        res.status(500).send('error' +err)
    }
   
});

router.get('/opration/screen', async (req, res) => {
    
    try {
       
        res.send('screen shot operation');
    } catch (err) {
        res.status(500).send('error' +err)
    }
    
});

//store location
router.post('/opration/location', async (req, res) => {
    try {
       
        res.send('save location operation');
    } catch (err) {
        res.status(500).send('error' +err)
    }
   
});


module.exports = router