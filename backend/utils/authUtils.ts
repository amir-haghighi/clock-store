import jwt from "jsonwebtoken";

export const createJwtToken = (user, statusCode, res) => {

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET! as string,
        {
            expiresIn: process.env.JWT_EXPIRES_IN!
        } as jwt.SignOptions
    );

    const cookieOptions = {
        expires: new Date(
            Date.now() +
            +process.env.JWT_COOKIE_EXPIRES_IN! * 24 * 60 * 60 * 1000
        ),

        httpOnly: true,

        secure: process.env.NODE_ENV === "production",
    };

    user.password = undefined;

    res.cookie("jwt", token, cookieOptions);

    res.status(statusCode).json({
        status: "success",
        token,

        data: {
            user,
        },
    });
};