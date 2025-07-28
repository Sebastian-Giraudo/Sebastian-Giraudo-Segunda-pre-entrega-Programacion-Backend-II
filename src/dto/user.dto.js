// src/dto/user.dto.js
class UserDTO {
    constructor(user) {
        // Asigna solo las propiedades deseadas del objeto 'user'
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
        this.cart = user.cart ? user.cart._id : null; // Solo enviamos el ID del carrito si existe
    }
}

module.exports = UserDTO;