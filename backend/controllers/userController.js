import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

//create token
const createToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign({id}, process.env.JWT_SECRET);
}

//login user
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password"
            });
        }

        const user = await userModel.findOne({email})

        if(!user){
            return res.status(404).json({success:false, message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(401).json({success:false, message: "Invalid credentials"})
        }

        const token = createToken(user._id)
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({success:false, message: "Server error occurred"})
    }
}

//register user
const registerUser = async (req,res) => {
    const {name, email, password} = req.body;
    try{
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        //check if user already exists
        const exists = await userModel.findOne({email})
        if(exists){
            return res.status(409).json({success:false, message: "User already exists"})
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.status(400).json({success:false, message: "Please enter a valid email"})
        }
        if(password.length<8){
            return res.status(400).json({success:false, message: "Password must be at least 8 characters long"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({name, email, password: hashedPassword})
        const user = await newUser.save()
        const token = createToken(user._id)
        
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({success:false, message: "Server error occurred"})
    }
}

export {loginUser, registerUser}