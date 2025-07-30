// src/repositories/TicketRepository.js
const TicketDAO = require('../dao/mongo/TicketDAO'); 

class TicketRepository {
    constructor() {
        this.dao = new TicketDAO();
    }

    async createTicket(ticketData) {
        return await this.dao.create(ticketData);
    }

    async getTicketById(ticketId) {
        return await this.dao.getById(ticketId);
    }

    
}

module.exports = TicketRepository;