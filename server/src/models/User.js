import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
        },
        fullname: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters']
        },
        profilepic: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: function(doc, ret) {
                delete ret.password;
                return ret;
            }
        }
    }
);

const User = mongoose.model("User", userSchema);

export default User;

