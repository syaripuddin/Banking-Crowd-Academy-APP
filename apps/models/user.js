const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, "Please tell your first name!"],
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "Please tell your last name!"],
    },
    photoProfile: {
        type: String,
        trim: true,
        //required: [true, "Please upload your photo profile!"],
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Please input your password"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error("Please provide a valid email address!");
            }
        },
    },
    role: {
        type: String,
        enum: ["learner", "teacher", "admin"],
        default: "learner",
    },
    password: {
        type: String,
        required: [true, "Please input password"],
        minlength: 7, // min 7 char
        trim: true, // auto hapus spasi kiri dan kanan
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                // biar gak asal input password jadi password
                throw Error("Your password is invalid!");
            }
        },
    },
    passwordConfirm: {
        type: String,
        required: [false, "Please confirm your password"],
        validate(value) {
            // This only works on CREATE and SAVE!!!
            if (this.password !== this.passwordConfirm) {
                return true;
            }
        },
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        },
    }, ],
    statusUser: {
        type: Boolean,
        default: false,
    },
    verification: {
        type: Boolean,
        default: false,
    },
    // class: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "class"
    // }]

}, { timestamps: true });


//generate token
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "DTS02PASTIBISA", {
        expiresIn: "7 days", // kalau mau ganti pake grammer english
    });

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.passwordConfirm;
    delete userObject.password;

    delete userObject.tokens;

    return userObject;
};

//LOGIC CEK LOGIN
userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw "Unable to login"; // user belum terdaftar
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw "Unable to login"; // password nya salah
    }

    return user;
};

//midleware buat hashing password
userSchema.pre("save", async function(next) {
    const user = this;
    //console.log(user);
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    if (user.passwordConfirm) {
        user.passwordConfirm = await bcrypt.hash(user.passwordConfirm, 8);
    }
    // this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;