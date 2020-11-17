const express = require("express");
const Class = require("../models/class");
const Enroled = require("../models/enroledclass")
const multer = require('multer');
const auth = require("../middleware/auth");



const classRouter = express.Router();


//multer setup output dan filename   //upload masih lokal
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/"); //masih lokal
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

//filter image only
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
//multer upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
});

//check role
const checkRole = (...roles) => { //...spread operator extrak isi array 
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.send(403) // error fobbriden
        }

        next();
    };
};

//upload photo
classRouter.post("/class/upload", auth, checkRole('teacher'), upload.single('photo'), (req, res, next) => {
    // console.log(req.file);
    if (!req.file) {
        res.status(500);
        return next(Error);
    }
    res.status(201).json({
        message: "Upload Class Photo successfully",
        pathphoto: req.file.path,
        ViewPhoto: {
            request: {
                type: 'GET',
                url: 'http://localhost:3000/uploads/' + req.file.filename //masih lokal
            }
        }
    })
})

classRouter.post("/class/", auth, checkRole('teacher'), async(req, res) => {
    try {

        //createclass
        const classs = new Class({
            ...req.body
        });
        await classs.save();


        const enroled = new Enroled({
            teacherId = req.body.teacherId,
            classId = Class._id
        })
        await enroled.save();

        res.status(201).json({
            message: "Created class successfully",
            Createdclass: {
                _id: Class._id,
                classname: Class.className,
                classdetail: Class.classDetail,
                classstart: Class.classStart,
                classend: Class.classEnd,
                classphoto: {
                    type: 'GET',
                    url: "http://localhost:3000/class/" + classname._id
                }
            }
        });
    } catch (err) {
        res.status(400).send(err);
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
        classs ? res.status(200).json({
            classs,
            ViewPhoto: {
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/uploads/' + classname.classphoto
                }
            }
        }) : res.status(404).send();
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
classRouter.get("/class/all", auth, async(req, res) => {
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
        }) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});


//get all list for enrol
classRouter.get("/class/all", auth, async(req, res) => {
    try {
        const classs = await Class.find({});
        classs ? res.status(200).json({
            class_id: classs._id,
            classname: classs.className
        }) : res.status(404).send();
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