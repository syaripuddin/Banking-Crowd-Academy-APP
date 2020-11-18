const express = require("express");
const Class = require("../models/class");
const Enroled = require("../models/enroledclass");
const auth = require("../middleware/auth");
const Article = require("../models/article");



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


articleRouter.post("/article/", auth, checkRole('teacher'), async(req, res) => {
    try {

        //createarticle
        const classs = new Article({
            ...req.body
        });
        await classs.save();
        console.log(req.body.teacherId + Article._id)


        const enroledClass = new Enroled({
            teacherId: req.body.teacherId,
            classId: Article._id
        })
        await enroledClass.save();


        res.status(201).send({ Article })
    } catch (err) {
        res.status(400).send(err.message);
    }

});


// Delete class
articleRouter.delete("/article/:id", auth, checkRole('teacher'), async(req, res) => {
    const classs = await Article.findByIdAndDelete(req.params.id);
    try {
        classs ? res.status(204).send(classs) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});


//get all list article
articleRouter.get("/article/all", auth, async(req, res) => {
    try {
        const article = await Article.find({});
        article ? res.status(200).json({
            article


        }) : res.status(404).send(err.message);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


//get class by id 
articleRouter.get("/article/:id", async(req, res) => {
    const article = await Article.findById(req.params.id);

    if(article) {
      res.json(article)
    } else {
      res.status(404).json({
        message: 'Article not found'
      })
    }
  });

module.exports = classRouter;