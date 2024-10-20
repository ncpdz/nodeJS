module.exports = function (req, res, next) {
    res.locals.username = req.session.username || null;
    next();
};
