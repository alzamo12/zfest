export const verifyEmail = (req, res, next) => {
    const user = req.user;
    if (!req.query.email) return res.status(400).send({ message: "Email required" });
    if (user.email !== req.query.email) {
        return res.status(403).send({ message: "Forbidden Access" });
    }
    next();
};