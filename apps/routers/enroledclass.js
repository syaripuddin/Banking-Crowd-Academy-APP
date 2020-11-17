const express = require("express");
const Enroled = require("../models/enroledclass");
const Class = require("../models/class");
const User = require("../models/user");
const auth = require("../middleware/auth");

const enrolClassRouter = express.Router();

//check role
const checkRole = (...roles) => { //...spread operator extrak isi array 
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.send(403) // error fobbriden
        }

        next();
    };
};

//get id learner
enrolClassRouter.get("/users", auth, checkRole("learner"), async(req, res) => {
    const users = await User.find({});
    try {
        users.length === 0 ? res.status(404).send() : res.send(users);
    } catch (err) {
        res.status(500).send("err.message");
    }
});

//get id teacher
enrolClassRouter.get("/users", auth, checkRole("teacher"), async(req, res) => {
    const users = await User.find({});
    try {
        users.length === 0 ? res.status(404).send() : res.send(users);
    } catch (err) {
        res.status(500).send("err.message");
    }
});

//create topic
enrolClassRouter.post("/class/enroll", auth, checkRole('learner', 'teacher'), async(req, res) => {
    // console.log(auth.token)
    try {

        const enroled = new({
            ...req.body //need 
        });
        await enrole.save();
        res.status(201).json({
            message: "Enroled Class successfully",
            Createdclass: {
                _id: Enroled._id,
                classid: Class.class_id,
                teacherd: Enroled.teacherid,
                learnind: Enroled.learnid,
                topicid: Enroled.topicid,
                jadwal: Enroled.jadwal,
                statusenroled: Enroled.statusenroled,
            }
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete topic
enrolClassRouter.delete("/enroledclass/:id", auth, checkRole('learner'), async(req, res) => {
    const enroled = await Enroled.findByIdAndDelete(req.params.id);
    try {
        enroled ? res.status(204).send(enroled) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//get all list for enrol
enrolClassRouter.get("/enroledclass/all", auth, checkRole('learner'), async(req, res) => {
    try {
        const enroled = await Enroled.find({});
        enroled ? res.status(200).json({
            enroled
        }) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});


module.exports = enrolClassRouter;