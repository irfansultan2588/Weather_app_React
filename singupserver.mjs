import express from "express"
import cors from "cors"
// import { nanoid } from 'nanoid'
import mongoose from 'mongoose';
import { stringToHash, varifyHash, } from "bcrypt-inzi"
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';


const SECRET = process.env.SECRET || "topsecret";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:3000', "*"],
    credentials: true
}));

const port = process.env.PORT || 3000;

// let userBase = [];

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    password: { type: String, required: true },

    age: { type: Number, min: 18, max: 60, default: 18 },
    subject: Array,
    isMarried: { type: Boolean, default: false },


    createdOn: { type: Date, default: Date.now },
});

const userModel = mongoose.model('user', userSchema);


app.post("/signup", (req, res) => {

    let body = req.body;

    if (!body.firstName
        || !body.lastName
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    // let isFound = false;

    // for (let i = 0; i < userBase.length; i++) {
    //     if (userBase[i].email === body.email.toLowerCase()) {
    //         isFound = true;
    //         break;
    //     }
    // }
    // if (isFound) {
    //     res.status(400).send({
    //         message: `Email ${body.email} already exist.`
    //     });
    //     return;
    // }

    // check if user already exist // query email user

    // let newUser = new userModel({

    //     firstName: body.firstName,
    //     lastName: body.lastName,
    //     email: body.email.toLowerCase(),
    //     password: body.password
    // });

    userModel.findOne({ email: body.email }, (err, data) => {
        if (!err) {
            console.log("data: ", data);

            if (data) { // user already exist
                console.log("user already exist: ", data);
                res.status(400).send({ message: "user already exist," });
                return;

            } else { // user not already exist

                stringToHash(body.password).then(hashString => {

                    let newUser = new userModel({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        email: body.email.toLowerCase(),
                        password: hashString
                    });
                    newUser.save((err, result) => {
                        if (!err) {
                            console.log("data saved: ", result);
                            res.status(201).send({ message: "user is created" });
                        } else {
                            console.log("db error: ", err);
                            res.status(500).send({ message: "internal server error" });
                        }
                    });
                })

            }
        } else {
            console.log("db error: ", err);
            res.status(500).send({ message: "db error in query" });
        }
    })
});


app.post("/login", (req, res) => {

    let body = req.body;

    if (!body.email || !body.password) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }


    userModel.findOne({ email: body.email },
        { email: 1, firstName: 1, lastName: 1, password: 1, },
        (err, data) => {
            if (!err) {
                console.log("data: ", data);

                if (data) { // user found

                    varifyHash(body.password, data.password).then(isMatched => {

                        if (isMatched) {
                            var token = jwt.sign({
                                _id: data._id,
                                email: data.email,
                                iat: Math.floor(Date.now() / 1000) - 30,

                                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                            }, SECRET);

                            console.log("token:", token);

                            res.cookie('token', token, {
                                maxAge: 86_400_000,
                                httpOnly: true
                            });

                            res.send({
                                message: "Login successful",
                                profile: {
                                    email: data.email,
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    _id: data._id

                                }


                            });

                            return;
                        } else {

                            console.log("user not found: ", data);
                            res.status(401).send({ message: "Incorrect email.or password," });
                            return;

                        }
                    })


                } else { // user not found

                    console.log("user not found: ", data);
                    res.status(401).send({ message: "Incorrect email.or password," });
                    return;



                }
            } else {
                console.log("db error: ", err);
                res.status(500).send({ message: "Login failed please try later" });
            }
        })
});

app.post("/logout", (req, res) => {


    res.cookie('token', '', {
        maxAge: 0,
        httpOnly: true
    });

    res.send({ message: "Logout successful", });





});


app.use(function (req, res, next) {
    console.log("req.cookies: ", req.cookies);

    if (!req.cookies.token) {
        res.status(401).send({
            message: "include http-only credentials with every request"
        })
        return;
    }
    jwt.verify(req.cookies.token, SECRET, function (err, decodedData) {
        if (!err) {

            console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {
                res.status(401).send("token expired")
            } else {

                req.body.token = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})

app.get("/users", async (req, res) => {

    try {
        let allUser = await userModel.find({}).exec();
        res.send(allUser);

    } catch (error) {
        res.status(500).send({ message: "error getting users" });
    }
})


app.get("/profile", async (req, res) => {

    try {
        let user = await userModel.findOne({ _id: req.body.token._id }).exec();
        res.send(user);

    } catch (error) {
        res.status(500).send({ message: "error getting users" });
    }
})



// console.log(userBase, "userBase")

// res.status(200).send({ message: "user is created" });


// })

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

















// /////////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = process.env.MONGODBURI || 'mongodb+srv://abc:abc@cluster0.jqfzaar.mongodb.net/socialMediaBase?retryWrites=true&w=majority';
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////