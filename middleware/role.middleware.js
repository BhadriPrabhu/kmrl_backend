exports.authorize = (...roles) => {
    return (req, res, next) => {
        console.log('User Role:', req.user.role);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`,
            });
        }
        next();
    };
};