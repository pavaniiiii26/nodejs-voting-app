import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        min: 18,
        max: 80
    },

    email: {
        type: String,
        unique: true
    },

    mobile: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    aadharCard: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },

    isVoted: {
        type: Boolean,
        default: false
    }
});


// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// Compare Password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;