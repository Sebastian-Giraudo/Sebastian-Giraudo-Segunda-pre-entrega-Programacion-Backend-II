// src/dao/mongo/TicketDAO.js
const TicketModel = require('../../dao/models/ticket.model'); 

class TicketDAO {
    async create(ticketData) {
        try {
            const newTicket = await TicketModel.create(ticketData);
            console.log('TicketDAO: Ticket creado exitosamente:', newTicket);
            return newTicket;
        } catch (error) {
            console.error('TicketDAO: Error al crear ticket:', error);
            throw error;
        }
    }

    async getById(id) {
        try {
            const ticket = await TicketModel.findById(id).lean();
            console.log('TicketDAO: Ticket encontrado por ID:', ticket);
            return ticket;
        } catch (error) {
            console.error('TicketDAO: Error al buscar ticket por ID:', error);
            throw error;
        }
    }

    
}

module.exports = TicketDAO;