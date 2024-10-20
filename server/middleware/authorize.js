module.exports = function (roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        (req, res, next) => {
            if (req.session && req.session.userId) {
                if (roles.length && !roles.includes(req.session.role)) {
                    return res.status(403).json({ error: 'Forbidden' });
                }
                next();
            } else {
                res.status(401).json({ error: 'Unauthorized' });
            }
        }
    ];
};
