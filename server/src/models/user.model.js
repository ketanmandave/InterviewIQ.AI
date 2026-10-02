import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false,
        select: false
    },
    googleUid: {
        type: String,
        unique: true,
        sparse: true
    },
    credits:{
        type: Number,
        default:100
    }
}, { timestamps: true });

// Hash only when a password is created or changed. Google-only users have no password.
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
