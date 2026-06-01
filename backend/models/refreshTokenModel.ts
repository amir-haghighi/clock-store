import { model, Schema } from "mongoose";


const refreshTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
    },


},
    { timestamps: true }
)

export const RefreshToken = model("RefreshToken", refreshTokenSchema)