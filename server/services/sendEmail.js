const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "darcheimiriam2024@gmail.com",
        pass: "gfql bwjr czea zeap"
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log("Error verifying transporter: ", error);
    } else {
        console.log("Server is ready to take our messages");
    }
});


const sendEmail = async (mailOption) => {
    try {
        await transporter.sendMail(mailOption);
        console.log("Email sent successfully");
    } catch (error) {
        throw (error);
    }
};


module.exports = {
    sendEmail
};
