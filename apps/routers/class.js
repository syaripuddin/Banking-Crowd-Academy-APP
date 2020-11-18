const express = require("express");
const Class = require("../models/class");
const Enroled = require("../models/enroledclass");
const auth = require("../middleware/auth");



const classRouter = express.Router();




//check role
const checkRole = (...roles) => { //...spread operator extrak isi array 
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.send(403) // error fobbriden
        }

        next();
    };
};


classRouter.post("/class/", auth, checkRole('teacher'), async(req, res) => {
    try {

        //createclass
        const classs = new Class({
            ...req.body
        });
        await classs.save();
        console.log(req.body.teacherId + Class._id)


        const enroledClass = new Enroled({
            teacherId: req.body.teacherId,
            classId: Class._id
        })
        await enroledClass.save();


        res.status(201).send({ Class })
    } catch (err) {
        res.status(400).send(err.message);
    }

});

// Update class by ID for teacher
classRouter.patch("/class/:id", auth, checkRole('teacher'), async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["className", "classDetail", "classStart", "classEnd", "classPhoto", ];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(400).send();
    }

    try {
        const classs = await Class.findById(req.params.id);
        updates.forEach((update) => (classs[update] = req.body[update]));

        await classs.save();
        res.status(200).send({ Class })
    } catch (err) {
        res.status(500).send(err.message);
    }


});

// Delete class
classRouter.delete("/class/:id", auth, checkRole('teacher'), async(req, res) => {
    const classs = await Class.findByIdAndDelete(req.params.id);
    try {
        classs ? res.status(204).send(classs) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//get all list detail  buat dashboard home
classRouter.get("/dashboard/class/all", auth, async(req, res) => {
    try {
        const classs = await Class.find({});
        classs ? res.status(200).json({
            classs,
            ViewPhoto: {
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/uploads/' + classs.classphoto
                }
            }
        }) : res.status(404).send(err.message);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


//get all list for enrol
classRouter.get("/class/all", auth, async(req, res) => {
    try {
        const classs = await Class.find({});
        classs ? res.status(200).json({
            classs


        }) : res.status(404).send(err.message);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


//get class by id kalau user pilih spesifik
classRouter.get("/class/:id", async(req, res) => {
    const _id = req.params.id;
    try {
        const classs = await Class.findById(_id);
        classs ? res.status(200).json({
            classs,
            ViewPhoto: {
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/uploads/' + classs.classphoto
                }
            }
        }) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = classRouter;