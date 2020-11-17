const express = require("express");
const morgan = require("morgan");
require("./databases/database");
const userRouter = require("./routers/user");
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");

//app assign express
const app = express();

//app.use(fileupload());
app.use('/uploads', express.static('uploads'));

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json biar bisa method post pake json
app.use(bodyParser.json());

//post setting
const port = process.env.PORT || 3000;

//for debuggin wiht morgan
app.use(morgan("dev"));

//controller user
app.use(userRouter);


const Checkverify = (...statususer) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403); // error forbidden
        }
        next(); // lanjut 
    };
};


//for home page
app.get('/', auth, Checkverify(true), (req, res, next) => {
    res.json({
        message: 'homepage'
    })

    //res.render('pages/home')
})

//for render login page
app.get('/login', function(req, res) {
    res.json({
            message: 'login'
        })
        // res.render('pages/login');
});

//for render registration page
app.get('/signup', function(req, res) {
    res.json({
            message: 'signup'
        })
        // res.render('pages/signup');
});







app.listen(port, () => {
    console.log("Server is up on port " + port);
});