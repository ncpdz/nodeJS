module.exports = function (req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.status(401).json({ error: "User not authenticated" });
    }
};
