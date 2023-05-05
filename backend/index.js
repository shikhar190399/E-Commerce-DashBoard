const express= require("express");
const cors = require("cors")
require("dotenv").config();
require('./db/config');
const User = require("./db/User");
const Product = require("./db/Product")

const Jwt = require('jsonwebtoken')
const jwtKey = process.env.JWTKEY

const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req,res) => {
    try {
        console.log(req.body)
        let user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        delete result.password
        Jwt.sign({result}, jwtKey, {expiresIn: "2h"} ,(err,token) => {
            if(err){
                res.send({result: "something went wrong. Please try after sometime"})
            }
            res.send({result, auth: token})
        })
            
    } catch (err) {
        console.log(err)
        res.send({err})
    }
})

app.post("/login", async (req,res) => {
    console.log(req.body)
    if(req.body.password && req.body.email){
        let user = await User.findOne(req.body ).select("-password") ;
        if(user)
            {
                Jwt.sign({user}, jwtKey, {expiresIn: "2h"} ,(err,token) => {
                    if(err){
                        res.send({result: "something went wrong. Please try after sometime"})
                    }
                    res.send({user, auth: token})
                })
            
            }
        else {
            res.send({result: 'No user found'})
            } 
    } else {
        res.send({result: 'No user found'})
    }
})

app.post("/add-product", verifyToken, async (req,res) => {
    try {
        let product = new Product(req.body);
        let result = await product.save();
        res.send(result)            
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

app.get("/products", verifyToken, async (req,res)=> {
    let products = await Product.find();
    if(products.length>0){
        res.send(products)
    }else {
        res.send({result: "No products found"})
    }
})

app.delete("/product/:id", verifyToken, async (req,res) =>{
    const result = await Product.deleteOne({_id:req.params.id})
    res.send(result) 
})

app.get("/product/:id", verifyToken, async (req,res) => {
    let result = await Product.findOne({_id:req.params.id});
    if(result){
        res.send(result)
    } else {
        res.send({result: "No record found"})
    }
}) 

app.put("/product/:id", verifyToken, async (req,res) => {
    let result = await Product.updateOne(
        
        {_id: req.params.id } , 
        {
            $set : req.body 
        }
    ) 
    console.log(result);
    res.send(result)
});

app.get("/search/:key", verifyToken, async (req,res) => {
    let result = await Product.find({
        "$or": [
            {name: {$regex: req.params.key}},
            {company: {$regex: req.params.key}},  
            {category: {$regex: req.params.key}},
        ]
    })
    res.send(result); 
})


function verifyToken(req,res, next){
    let token = req.headers['authorization'];
    if(token){
        token = token.split(' ')[1];
        console.warn("middleware called if", token)
        Jwt.verify(token, jwtKey, (err,valid) => {
            if(err){
                res.status(401).send({result : "Please provide valid token with header" })
            }else{
                next();
            }
        })
    }else{
        res.status(403).send({result : "Please add token with header" })
    }    
}

app.listen(4000);
 