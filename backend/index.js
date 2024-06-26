const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
require("dotenv").config();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors({
    origin: ["http://localhost:3000"],    
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());



// User Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = mongoose.model("User", userSchema);

const stockSchema = new mongoose.Schema({
    name: String,
    symbol: String,
    exchange: String,
    issueId: Number,    
    country: String
})

const Stock = mongoose.model("Stock", stockSchema);

const portfolioSchema = new mongoose.Schema({
    email: String,
    name: String,
    currency: String,
    stocks: [stockSchema]
})
const Portfolio = mongoose.model("Portfolio", portfolioSchema);

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

app.get('/', (req, res) => {
    res.status(200).json({ "msg": "Hello world" });
})
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1h" });
}
// Signup Route
app.post("/api/signup", [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const email = req.body.email;
        const password= req.body.password;
        console.log(email, password);

        // const existingUser = await User.findOne({email});
        // if(existingUser){
        //     return res.status(400).json({ message: "User already exists" });
        // }

        // const newUser = new User({
        //     email: email,
        //     password: password
        // })
        // await newUser.save()
        // .then(response =>{
        //     if(response){
        //         res.status(200).json({email: email});
        //     }
        // })
        // .catch(error => console.log(error))

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res
            .status(201)
            .json({ message: "User created successfully", success: true });
    } catch (error) {
        console.error(error);

        res.status(500).json({            
            message: "Internal server error"
        });
    }
});
// Login Route
app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(`email: ${email}`)
      console.log(`password: ${password}`)
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Compare passwords
      const passwordMatch = bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, "secretKey", {
        expiresIn: "5d",
      });
  
      res.status(200).json({
        success: true,
        token: token,
      });
    } catch (error) {
      
      console.log(error);
      res.status(500).json({ success:false, message: "Internal server error" });
    }
  });

app.post('/api/portfolio', async (req, res) => {
    const {email, name, currency, stocks} = req.body;
    console.log(name, currency);
    const portfolio = new Portfolio({
        email: email,
        name: name,
        currency: currency,
        stocks: []
    });
    await portfolio.save().then(response => {
        res.status(200).json({"message": response});
    })
    .catch(err => {res.status(500).json({"error": err})});
})

app.get('/api/portfolio', async (req, res) => {
    try {
        const result = await Portfolio.find({});    
        res.status(200).json(result);        
    } catch (error) {
        res.status(400).json({"error":error});
    }
})

app.get('/api/stocks/:name', async(req, res) => {
    try{
        const portFolioName = req.params.name;
        console.log(portFolioName);

        Portfolio.findOne({name: portFolioName})
        .then(portfolio => {
            const result = portfolio.stocks;
            console.log(result);
            res.status(200).json({result});
        });
    }
    catch(err){
        res.status(400).json({"error":err});
    }
})

app.post('/api/stocks/:name', async(req, res) => {
    const portFolioName = req.params.name;
    const data = req.body;

    Portfolio.findOne({name: portFolioName})
    .then(async portfolio => {
        portfolio.stocks.push(data);
        await portfolio.save();    
    })
    .catch(err => console.log(err));

    res.status(200).json({data, name: portFolioName});
})


try {
    mongoose
        .connect(process.env.MONGODB_URL, {

        })
        .then(() => console.log(`MongoDB connected successfully`))
        .catch((error) => {
            console.log("Issue in MongoDB connection!!");
            console.log(error);
            process.exit(1);
        });

    app.listen(process.env.PORT, (req, res) => {
        console.log("Server started on 4000");
    })
}
catch (error) {
    console.log(error);
}