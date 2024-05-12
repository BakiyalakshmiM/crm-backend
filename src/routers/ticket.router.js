const express= require("express");
const { insertTicket, getTicket, getTicketById, updateClientReply, updateStatusClose, deleteTicket} = require("../Models/Ticket/Ticket.model")
const { userAuthorization} = require("../middleware/authorization.middleware")

const router = express.Router();

router.all('/', (req, res, next)=> {
    next();
})

router.post('/', userAuthorization,async ( req, res)=> {
    try{
        const { subject, sender, message} = req.body;
        const ticketObj = {
            clientId: req.userId,
            subject,
            conversations: [
                {
                    sender,
                    message
                }
            ]
        }

        let result = await insertTicket(ticketObj)

        if(!result._id){
            return res.status(500).json({ message: `Error in creating ticket`, err})
        }

        return res.status(200).json({ message:"Created New Ticket", result})
    } catch( err){
        res.status(500).json({ message: `Error in creating ticket`, err: err.message})
    }
})

router.get('/', userAuthorization, async ( req, res)=>{
    try{
        let _id = req.userId;

        let ticket = await getTicket(_id);

        if(!ticket.length){
            return res.status(404).json({ message: `No tickets available for the user`})
        }

        return res.status(200).json({ ticket})

   } catch( err){
        res.status(500).json({ message: `Error in getting ticket details`, err: err.message})
    }
})

router.get('/:ticketId', userAuthorization, async ( req, res)=>{
    try{
        let { ticketId} = req.params;
        let userId = req.userId;

        console.log(`... ${ticketId}  ,,,,,,, ${userId}`)

        let ticket = await getTicketById( ticketId, userId);

        if(!ticket){
            return res.status(404).json({ message: `No tickets available with the id ${ticketId}`})
        }

        return res.status(200).json({ ticket})

   } catch( err){
        return res.status(500).json({ message: `Error in getting ticket detail`, err: err.message})
    }
})

router.put('/:ticketId', userAuthorization, async ( req, res)=>{
    try{
        const { sender, message} = req.body;
        console.log(JSON.stringify(req.body));
        let { ticketId} = req.params;
        let userId = req.userId;

        console.log(`... ${ sender} **** ${message}`)

        let ticket = await updateClientReply( ticketId, sender, message);

        if(!ticket?._id){
            return res.status(404).json({ error: 'Unable to update the message. Please try again'})
        }

        return res.status(200).json({ message:'Ticket Updated Successfully.' , ticket})

   } catch( err){
        return res.status(500).json({ message: `Error in getting ticket detail`, err: err.message})
    }
})

router.patch('/close-ticket/:_id', userAuthorization, async ( req, res)=>{
    try{
        let { _id} = req.params;
        let clientId = req.userId;

        let ticket = await updateStatusClose( _id, clientId);

        if(!ticket.id){
            return res.status(404).json({ error: 'Unable to update the message. Please try again'})
        }

        return res.status(200).json({ ticket})

   } catch( err){
        return res.status(500).json({ message: `Error in getting ticket detail`, err: err.message})
    }
})



router.delete('/:_id', userAuthorization, async ( req, res)=>{
    try{
        let { _id} = req.params;
        let clientId = req.userId;

        let ticket = await deleteTicket( _id, clientId);

        return res.status(200).json({message: `Ticket deleted successfully ${_id}`})

   } catch( err){
        return res.status(500).json({ message: `Error in deleting ticket ${req.params._id}`, err: err.message})
    }
})
module.exports = router;