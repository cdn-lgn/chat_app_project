import jwt from "jsonwebtoken";
// import dotenv from "dotenv"

// Cookie parameters for the token
const cookiesParameters = {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    sameSite: "none",
    httpOnly: true,
    secure: true,
};

// Function to generate a JWT and set it as a cookie in the response
const webTokenGenrator = (res, user, code, message) => {
    const { username } = user;

    // Generate the JWT with the userID as the payload
    const userToken = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN);

    // Set the JWT as a cookie and send the response
    return res
        .status(code)
        .cookie("userToken", userToken, cookiesParameters)
        .json({
            success: true,
            message: message,
            userToken: userToken,
        });
};

export { webTokenGenrator, cookiesParameters };
