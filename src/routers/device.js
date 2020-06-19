const Device = require('../models/device')
const auth = require('../middleware/auth')
const express = require('express')
const router = new express.Router

// add new Device
router.post('/devices', auth, async(req, res) => {
   
    const device = new Device({
        ...req.body,
        owner:req.user._id
    })
    try {
        const result = await device.save()
        res.status(201).send(result.name +' Added successfully! ');
    } catch (err) {
        res.status(400).send('error '+err);
    }
});

//get Device by id
router.get('/devices/:id', auth,async(req, res) => {
    const _id = req.params.id
    try {
        // const Device = await Device.findById(_id)
        const device = await Device.findOne({ _id, owner:req.user._id})
        if(!device){
            return res.status(404).send()
        }
        res.send(device);
    } catch (err) {
        res.status(500).send('error' +err)
    }
    
});

// get all Devices
router.get('/devices', auth, async (req, res) => {
    try {
        // const Devices = await Device.find({ owner:req.user._id }) works too
        await req.user.populate('devices').execPopulate()
        res.send(req.user.devices);
    } catch (err) {
        res.status(500).send('error' +err)
    }
});
 
// update Device
router.patch('/devices/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','color','imei','type','owner']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({error:'Invalid Operation '})
    }
    try {
        const device = await Device.findOne({ _id: req.params.id , owner:req.user._id})

        if (!device) {
            return res.status(404).send()
        } 

        updates.forEach((update) => device[update] = req.body[update])
        await device.save()

       
        res.status(201).send(device);
    } catch (err) {
        res.status(500).send('error' +err)
    }

});

// transfer Device
router.patch('/devices/transfer/:id', auth, async(req, res) => {
    
    const updates = Object.keys(req.body)
    const allowedUpdates = ['owner']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({error:'Invalid Operation '})
    }
    try {
        const device = await Device.findOne({ _id: req.params.id , owner:req.user._id})

        if (!device) {
            return res.status(404).send()
        } 

        updates.forEach((update) => device[update] = req.body[update])
        await device.save()

        res.status(201).send(device.name + "Transfered successfully "); 
    } catch (err) {
        res.status(500).send('error' +err)
    }

});
// delete Device
router.delete('/devices/:id', auth, async (req, res) => {
    try {
        const device = await Device.findOneAndDelete({owner:req.user._id , _id:req.params.id})
        if (!device) {
            return res.status(404).send()
        }
        res.send('Device deleted');
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router