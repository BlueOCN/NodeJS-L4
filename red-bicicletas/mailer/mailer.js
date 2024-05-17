const nodemailer = require('nodemailer');

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'christiana24@ethereal.email',
        pass: 'uGxK1V6z8JXEtZe1Ry'
    }
};

module.exports = nodemailer.createTransport(mailConfig);