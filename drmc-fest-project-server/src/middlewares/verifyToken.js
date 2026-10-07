// import admin from "../config/firebase.js";
import admin from "../config/firebase.js";

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers?.authorization;
    // console.log(authHeader)

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).send({ message: "unauthorized access" });
    }

    const token = authHeader.split(" ")[1];
    // console.log("Token:", token); // Log the token for debugging

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Error verifying token:", err);
        return res.status(401).send({ message: "unauthorized access" });
    }
};