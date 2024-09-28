import User from "../models/user-model.js";
import Business from "../models/business-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  createError from "../utils/createError.js";


export const registerBusiness = async (req, res, next) => {
    try {
      const {
        name,
        email, // User's personal email
        password,
        businessName,
        businessEmail, // Business contact email
        phoneNumber,
        city,
        street,
        categories,
        description,
        openingHours
      } = req.body;
  
      // 1. Hash the password
      const hash = await bcrypt.hash(password, 10);
  
      // 2. Create new user with isBusiness set to true
      const newUser = new User({
        name,
        email, // User's personal email
        password: hash,
        isBusiness: true, // Marking as business user
      });
  
      // 3. Save the user
      const savedUser = await newUser.save();
  
      // 4. Create a business entry for the user
      const newBusiness = new Business({
        owner: savedUser._id, // Reference to the business owner (user)
        businessName,
        email: businessEmail, // Business contact email
        phoneNumber,
        location: {
          city,
          street,
        },
        categories,
        description,
        openingHours,
      });
  
      // 5. Save the business
      await newBusiness.save();
  
      // 6. Send success response
      res.status(200).json({ message: 'Business registered successfully' });
    } catch (error) {
      // Handle duplicate errors (e.g., duplicate email)
      if (error.code === 11000) {
        if (error.keyPattern.email) {
          return res.status(400).json({ message: 'Email already exists' });
        } else if (error.keyPattern.name) {
          return res.status(400).json({ message: 'Username already exists' });
        }
      }
  
      // For other errors, pass them to the next middleware
      next(error);
    }
  };

export const registerUser = async (req,res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const newUser = new User ({
            ...req.body,
            password: hash
        });
        await newUser.save();
        res.status(200).send("User added");
    } catch (error) {
        next(error);
    }

};

export const login = async (req,res,next) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if(!user) return next(createError(404,"User not found!"));

        const isCorrect = bcrypt.compareSync(req.body.password, user.password);
        if(!isCorrect) return next(createError(400, "Wrong password or username!"));

        const token = jwt.sign({
            id: user._id, isBusiness: user.isBusiness
        },
            process.env.JWT_KEY
        );

        const {password, ...info} = user._doc;
        res.cookie("accessToken", token, {httpOnly: true}).status(200).send(info);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req,res) => {
    res.clearCookie("accessToken", {
        sameSite: "none",
        secure: true,
    }).status(200).send("User has been logged out.");
};