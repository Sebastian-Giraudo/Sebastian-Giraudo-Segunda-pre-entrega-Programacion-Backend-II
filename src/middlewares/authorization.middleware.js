const authorization = (roles) => {
    return (req, res, next) => {
        // req.user viene de passport.authenticate('current')
        // Si no hay usuario autenticado, o si el usuario no tiene un rol asignado
        if (!req.user || !req.user.role) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized: User not authenticated or role not found.' });
        }

        // Si el rol del usuario no está incluido en los roles permitidos
        if (!roles.includes(req.user.role)) {
            // Si el usuario es un 'user' y está intentando acceder a una ruta de admin (por ejemplo, crear producto)
            if (req.user.role === 'user') {
                return res.status(403).json({ status: 'error', message: 'Forbidden: You do not have permission to access this resource.' });
            }
            // Para otros roles que no estén en la lista y no sean 'user' específico
            return res.status(403).json({ status: 'error', message: 'Forbidden: Your role does not have permission for this action.' });
        }

        // Si el usuario tiene el rol permitido, pasa al siguiente middleware/controlador
        next();
    };
};

module.exports = authorization;