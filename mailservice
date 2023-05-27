
import nodemailer from "nodemailer";
   
const sendWelcomeMail = (mail) => {
      let mailTransporter = nodemailer.createTransport({
        host: "mail.napsugarvh.hu",
        port: 465,
        secure: true,
        auth: {
          user: process.env.USERNAME,
          pass: process.env.MAIL,
        },
      });
    
      // setting credentials
      let mailDetails = {
        from: {
          name: 'Napsugár Vendégház',
          address: 'info@napsugarvh.hu'
        },
        to: mail,
        subject: "Napsugár Vendégház: Minden amit tudnod kell",
        html : { path: 'template.html' }
      };
    
      // sending email
      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log("error occurred", err.message);
        } else {
          console.log("---------------------");
          console.log("email sent successfully");
        }
      });
    }

  const sendLeaveMail = (mail) => {
    let mailTransporter = nodemailer.createTransport({
      host: "mail.napsugarvh.hu",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USERNAME,
        pass: process.env.MAIL,
      },
    });
  
    // setting credentials
    let mailDetails = {
      from: {
        name: 'Napsugár Vendégház',
        address: 'info@napsugarvh.hu'
      },
      to: mail,
      subject: "Napsugár Vendégház: Minden amit tudnod kell",
      html : { path: 'template.html' }
    };
  
    // sending email
    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log("error occurred", err.message);
      } else {
        console.log("---------------------");
        console.log("email sent successfully");
      }
    });
  }

export {
    sendWelcomeMail,
    sendLeaveMail
};
