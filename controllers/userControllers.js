// Import necessary modules 
const User = require('../models/userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const generate = require('../utility/generateToken');

// Controller function to create a new user
const createUser = async (req, res) => {
    try {
         // Extract user data from the request body
        const { name, email, password } = req.body;

         // Retrieve the user making the request
        const user = req.user;

        // Check if the requesting user is an admin
        if (user.isAdmin == true) {
            const userExists = await User.findOne({ email: email });

            if (userExists) {
                return res.status(409).json({ error: 'User already exists'});
            };
    
            // Hash the password 
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            // Create a new user in the database
            const user = await User.create({
                name: name,
                email: email,
            });
        
            if (user) {
                return res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                })  
            } else {
                return res.status(400).json({ error: 'Invalid user data '})
            }
        } else {
            return res.status(409).json({ error: 'Unauthorized'});
        } 
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: error.stack
        })
    }
};  

// Controller function to log in a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user with the provided email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: 'User does not exists '});
        }

        // Check if the user exists and if the password matches
        const matchedPassword = await bcrypt.compare(password, user.password);

        if (user && matchedPassword) {
            generate(res, user._id)
            // Respond with the logged-in user's information
            return res.status(200).json({
                _id: user._id,
                email: user.email,
            })
        } else {
            return res.status(400).json({ message: 'Wrong email or password' });
        }
    } catch (error) {
        return res.status(500).json({ 
            error: error.message,
             stack: error.stack
        })
    }
};

// Controller function to log out a user
const logoutUser = async (req, res) => {
    try {
    // Clear the JWT cookie to log the user out
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
      })  

      // Successfully logout
      return res.status(200).json({ message: 'User logged out '});
    } catch (error) {
        res.status(500).json({
            error: error.message,
            satck: error.stack
        })
    }
};

// Controller function to get all user profiles
const getAllUserProfiles = async (req, res) => {
    try {
        const users = await User.find({}).select('password -createdAt -updatedAt -__v').sort({createdAt: -1});

        return res.status(400).json(users);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
}

// Controller function to get the profile of the authenticated user
const getUserProfile = async (req, res) => {
    try {
        const { user } = req;

    // Respond with the authenticated user's profile
    res.json(user);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
}

// Controller function to delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

         // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'No such user' });
        }

        // Find and delete the user by ID
        const deleteUser = await User.findOneAndDelete({ _id: id});

        if (!deleteUser) {
            return res.status(400).json({ error: 'No such user exists' });
        }

        return res.status(200).json({ error: 'User Deleted Successfully' });
    } catch (error) {
         // Handling the errors 
        return res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
}

// Controller function to update a user by ID
const updateUser = async (req, res) => {
    try {
        // Extract the user ID from the request parameters
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such user' });
    }

    // Find and update the user by ID with the provided data
    const updateUser = await User.findOneAndUpdate(
        {_id: id},
        {...req.body},
        {new: true}
    );

    if (!updateUser) {
        return res.status(400).json({ error: 'No such user' });
    }
    return res.status(200).json(updateUser);
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
}

// Export all the user controller functions
module.exports = { createUser, loginUser, logoutUser, getAllUserProfiles, getUserProfile, deleteUser, updateUser };
    
    