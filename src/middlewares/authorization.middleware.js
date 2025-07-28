//src\middlewares\authorization.middleware.js
const authorization = (roles) => {
    return (req, res, next) => {        
        // Si no hay usuario autenticado, o si el usuario no tiene un rol asignado
        if (!req.user || !req.user.role) {
            return res.status(401).json({ status: 'error', message: 'No autorizado: usuario no autenticado o rol no encontrado.' });
        }

        // Si el rol del usuario no está incluido en los roles permitidos
        if (!roles.includes(req.user.role)) {
            // Si el usuario es un 'user' y está intentando acceder a una ruta de admin (por ejemplo, crear producto)
            if (req.user.role === 'user') {
                return res.status(403).json({ status: 'error', message: 'Prohibido: No tienes permiso para acceder a este recurso.' });
            }
            // Para otros roles que no estén en la lista y no sean 'user' específico
            return res.status(403).json({ status: 'error', message: 'Prohibido: tu rol tiene permiso para esta acción.' });
        }

        // Si el usuario tiene el rol permitido, pasa al siguiente middleware/controlador
        next();
    };
};

module.exports = authorization;