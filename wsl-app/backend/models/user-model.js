import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    }
,
    email: {
        type: String,
        required: true,
        unique: true
    }

    ,
    password: {
        type: String,
        required: true,
    }

    ,
    isBusiness: {
        type: Boolean,
        default: false,
    }
},
{
    timestamps: true
})

export default mongoose.model("User", userSchema);