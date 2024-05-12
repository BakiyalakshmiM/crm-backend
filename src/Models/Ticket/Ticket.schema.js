const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        
    },
    subject:{
        type: String,
        maxLength: 50,
        required: true
    },
    openAt: {
        type:   Date,
        required: true,
        default: Date.now()
    },
    status: {
        type: String,
        maxLength: 30,
        required: true,
        default: 'Pending Operator Response'
    },
    conversations: [
        {
            sender: {
                type: String,
                maxLength: 50,
                required: true,
                default: ''
            },
            message: {
                type: String,
                maxLength: 1000,
                required: true,
                default: ''
            },
            msgAt: {
                type: Date,
                required: true,
                default: Date.now()
            }
        }
    ]
})

module.exports = {
    TicketSchema: mongoose.model("ticket", TicketSchema)
}