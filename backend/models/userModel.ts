import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import validator from "validator";
type AddressType = {
    country: string;
    city: string;
    fullAddress: string;
    postalCode: string;
};
export type UserType = {
    name: string;
    password: string;
    passwordConfirm?: string | undefined;
    role: "user" | "admin";
    isVerified: boolean;
    email?: string;
    avatar?: string;
    addresses?: AddressType[];
    passwordResetToken?: string;
    passwordResetTokenExpiresAt?: Date
};
const addressSchema = new Schema({
    country: { type: String, required: true },
    city: { type: String, required: true },
    fullAddress: { type: String, required: true },
    postalCode: { type: String, required: true },

});
const userSchema = new Schema<UserType>({
    name: { type: String, required: [true, "name is required"] },
    password: {
        type: String,
        required: [true, "required"],
        minLength: [3, "min length is 3!"],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "required"],
        minLength: [3, "min length is 3!"],
        select: false,
        // this only works on create and save !
        validate: {
            validator: function (this: any, el: string) {
                return el === this.password;
            },
            message: "passwords are not the same",
        },
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    isVerified: { type: Boolean, default: false },

    email: {
        type: String,
        required: [true, "Email number is required!"],
        unique: [true, "This email number is already signed up!"],
        // sparse: true,
        validate: [validator.isEmail, "Invalid email number"]
    },

    avatar: { type: String },

    addresses: {
        type: [addressSchema],
        default: []
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetTokenExpiresAt: {
        type: Date
    }
},

    { timestamps: true }
);

userSchema.pre("save", async function () {
    // only hash if password changed
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    return
});

export const User = model<User>("User", userSchema);