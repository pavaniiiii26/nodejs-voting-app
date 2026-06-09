import express from 'express';
import bcrypt from 'bcrypt';

import User from '../models/user.js';
import { generateToken, jwtAuthMiddleware } from '../jwt.js';

const router = express.Router();


// SIGNUP
router.post('/signup', async (req, res) => {

    try {

        const newUser = new User(req.body);

        const savedUser = await newUser.save();

        const token = generateToken(savedUser);

        res.status(201).json({
            message: 'User Created Successfully',
            token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: error.message
        });
    }
});


// LOGIN
router.post('/login', async (req, res) => {

    try {

        const { aadharCard, password } = req.body;

        const user = await User.findOne({ aadharCard });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid Aadhar Card or Password'
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid Aadhar Card or Password'
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            token
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
});


// PROFILE
router.get('/profile', jwtAuthMiddleware, async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
});

// UPDATE PROFILE
router.put('/profile', jwtAuthMiddleware, async (req, res) => {

    try {

        const updates = req.body;

        // Don't allow changing _id
        delete updates._id;

        // If password is being updated, hash it
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
});


export default router;