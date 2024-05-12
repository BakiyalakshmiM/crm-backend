const { TicketSchema} = require('./Ticket.schema');

const insertTicket = async ( ticketObj) => {
    return new Promise(async ( resolve, reject)=> {
        try{
            let ticket = await TicketSchema(ticketObj).save()
            resolve(ticket);
        } catch (err){
            reject(err);
        }
    })
}

const getTicket = async(clientId) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            let ticket = await TicketSchema.find({clientId})
            resolve(ticket)
        } catch (err){
            reject(err);
        }
    })
}

const getTicketById = async( _id, clientId) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            let ticket = await TicketSchema.findOne({clientId, _id})
            resolve(ticket)
        } catch (err){
            reject(err);
        }
    })
}

const updateClientReply = async( _id, sender, message)=>{
    return new Promise(async( resolve, reject)=>{
        try{

            let ticket = await TicketSchema.findOneAndUpdate({_id}, {
                status: 'Pending Operator Response',
                $push: {
                    conversations: {
                        sender,
                        message
                    }
                }
            }, { new: true})
            resolve(ticket)
        } catch( err){
            console.log(err)
            reject(err);
        }
    })
}

const updateStatusClose = ( _id, clientId) => {
    return new Promise(async( resolve, reject)=>{
        try{

            let ticket = await TicketSchema.findOneAndUpdate({_id, clientId}, {
                status: 'Closed'
            }, { new: true})
            resolve(ticket)
        } catch( err){
            console.log(err)
            reject(err);
        }
    })
}

const deleteTicket = ( _id, clientId) => {
    return new Promise(async( resolve, reject)=>{
        try{
            let ticket = await TicketSchema.deleteOne({_id, clientId})
            resolve(ticket)
        } catch( err){
            console.log(err)
            reject(err);
        }
    })
}

module.exports = {
    insertTicket,
    getTicket,
    getTicketById,
    updateClientReply,
    updateStatusClose,
    deleteTicket
}