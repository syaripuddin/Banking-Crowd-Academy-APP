const express = require("express");
const Class = require("../models/class");
const User = require("../models/user");
const Topic = require("../models/topic");
//const Article = require("../models/article");
const auth = require("./middleware/auth");
const boardRouter = express.Router();


const CheckRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.send(403); // error forbidden
        }

        next(); // lanjut 
    };
};


boardRouter.get("/info", auth, CheckRole("admin"), async(req, res) => {

    try {
        const users = await User.find({}).count();
        const classes = await Class.find({}).count();
        const topics = await Class.find({}).count();
        const activeLearner = await User.find({
            "statusUser": 1,
            "role": "learner"
        }).count();
        const unactiveLearner = await User.find({
            "statusUser": 0,
            "role": "learner"
        }).count();
        const activeTeacher = await User.find({
            "statusUser": 1,
            "role": "teacher"
        }).count();
        const unactiveTeacher = await User.find({
            "statusUser": 0,
            "role": "teacher"
        }).count();
        // console.log(users,
        //     classes,
        //     topics,
        //     activeLearner,
        //     unactiveLearner,
        //     activeTeacher,
        //     unactiveTeacher)

        users, classes, topics, activeLearner, unactiveLearner, activeTeacher, unactiveTeacher ? res.status(200).json({
            users,
            classes,
            topics,
            activeLearner,
            unactiveLearner,
            activeTeacher,
            unactiveTeacher
        }) : res.status(404).send();

    } catch (err) {
        res.status(500).send("err.message");
    }
});

module.exports = boardRouter;