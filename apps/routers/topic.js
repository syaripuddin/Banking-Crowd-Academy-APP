const express = require("express");
const Topic = require("../models/topic");
const auth = require("../middleware/auth");

const topicRouter = express.Router();

//check role
const checkRole = (...roles) => { //...spread operator extrak isi array 
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.send(403) // error fobbriden
        }

        next();
    };
};

//create topic
topicRouter.post("/topic/", auth, checkRole('teacher'), async(req, res) => {
    // console.log(auth.token)
    try {

        const topic = new({
            ...req.body //need 
        });
        await topic.save();
        res.status(201).json({
            message: "Created topic successfully",
            Createdclass: {
                _id: Topic._id,
                classid: Topic.class_id,
                topicname: Topic.topicname,
                topicdetail: Topic.topicdetail,
                topicdocument: Topic.topicdocument,
            }
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update topic by ID for teacher
topicRouter.patch("/topic/:id", auth, checkRole('teacher'), async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["topicname", "topicdetail", "topicdocument"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(400).send();
    }

    try {
        const topic = await Topic.findById(req.params.id);
        updates.forEach((update) => (topic[update] = req.body[update]));

        await topic.save();
        topic ? res.status(200).json({
            topic
        }) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete topic
topicRouter.delete("/topic/:id", auth, checkRole('teacher'), async(req, res) => {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    try {
        topic ? res.status(204).send(topic) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//get all list topic
topicRouter.get("/topic/all", auth, async(req, res) => {
    try {
        const topic = await Topic.find({});
        topic ? res.status(200).json({
            topic
        }) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});


//get all list for enrol
topicRouter.get("/topic/all", auth, async(req, res) => {
    try {
        const topic = await Topic.find({});
        topic ? res.status(200).json({
            topic_id: topic._id,
            topicname: topic.topicname,
            topicdetail: topic.topicdetail,
        }) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});


//get class by id jika user pilih spesifik
topicRouter.get("/topic/:id", async(req, res) => {
    const _id = req.params.id;
    try {
        const topic = await Topic.findById(_id);
        topic ? res.status(200).json({
            topic,
        }) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = topicRouter;