// src/dao/mongo/TicketDAO.js
const TicketModel = require('../../dao/models/ticket.model'); 

class TicketDAO {
    async create(ticketData) {
        try {
            const newTicket = await TicketModel.create(ticketData);            
            return newTicket;
        } catch (error) {            
            throw error;
        }
    }

    async getById(id) {
        try {
            const ticket = await TicketModel.findById(id).lean();            
            return ticket;
        } catch (error) {          
            
            throw error;
        }
    }    
}

module.exports = TicketDAO;