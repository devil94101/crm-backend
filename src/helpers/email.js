const nodemailer = require('nodemailer')

const send = async (mail) =>{

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'alexanne.franecki@ethereal.email',
            pass: '99N8g4M2JARdyFzUV3'
        }
    });
  
    // send mail with defined transport object
    console.log(mail)
    let info = await transporter.sendMail(mail);
   
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

const emailProcessor = ({ email, pin, type, verificationLink = "" }) => {
    let info = "";
    email = "deepakpaliwal029@gmail.com"
    switch (type) {
      case "request-new-password":
        info = {
          from: '"CMR Company" <alexanne.franecki@ethereal.email>', // sender address
          to: email, // list of receivers
          subject: "Password rest Pin", // Subject line
          text:
            "Here is your password rest pin " +
            pin +
            " This pin will expires in 1day", // plain text body
          html: `<b>Hello </b>
        Here is your pin 
        <b>${pin} </b>
        This pin will expires in 1day
        <p></p>`, // html body
        };
  
        send(info);
        break;
  
      case "update-password-success":
        info = {
          from: '"CMR Company" <alexanne.franecki@ethereal.email>', // sender address
          to: email, // list of receivers
          subject: "Password updated", // Subject line
          text: "Your new password has been update", // plain text body
          html: `<b>Hello </b>
         
        <p>Your new password has been update</p>`, // html body
        };
  
        send(info);
        break;
  
      case "new-user-confirmation-required":
        info = {
          from: '"CMR Company" <alexanne.franecki@ethereal.email>', // sender address
          to: email, // list of receivers
          subject: "Please verify your new user", // Subject line
          text:
            "Please follow the link to very your account before you can login", // plain text body
          html: `<b>Hello </b>
          <p>Please follow the link to very your account before you can login</p>
          <p>${verificationLink}</P>
          `, // html body
        };
  
        send(info);
        break;
  
      default:
        break;
    }
  };

module.exports={
    emailProcessor
}