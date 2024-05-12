const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'adolphus.pfannerstill28@ethereal.email',
        pass: 'TC4yC8RTD5CkQeFzyj'
    }
});

const sendEmail = async (info) => {
    return new Promise(async ( resolve, reject)=> {
        try{
            const result = await transporter.sendMail(info);
    
            console.log(JSON.stringify(result))
            console.log("Message sent: %s", result.messageId);
            resolve(result);
        } catch( err){
            console.log(err)
            reject(err);
        }
    })
    }

const emailProcessor = async (email, pin, type) => {
    return new Promise(async ( resolve, reject)=> {

            let info = '';

            switch(type){
                case 'reset_password':
                    info = {
                        from: '"Ticket CRM" <willy.krajcik@ethereal.email>', // sender address
                        to: email, // list of receivers
                        subject: "Password Reset Pin", // Subject line
                        text: `Here is your password reset pin ${ pin}. This pin will expire in 1 day.`, // plain text body
                        html: `<b>Hello</b>
                        <p>Here is your password reset pin</p>
                        <b>${pin}</b>
                        <p>This pin will expire in 1 day.</p>
                        `
                      }
                    break;
                case "updated_password":
                    info = {
                        from: '"Ticket CRM" <willy.krajcik@ethereal.email>', // sender address
                        to: email, // list of receivers
                        subject: "Password Updated Successfully", // Subject line
                        text: `Your password updated successfully.`, // plain text body
                        html: `<b>Hello</b>
                        <p>Your password updated successfully.</p>
                        `
                      }
                    break;
            }
                
            
        try{
              let result = await sendEmail( info);
              resolve(result);

        } catch( err){
            console.log(`Error ${ err}`)
            reject(err);
        }
    })
}

module.exports = {
    emailProcessor
}