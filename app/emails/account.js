const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'rohanvaghsiya4465@gmail.com',
        subject: 'Thanks for joining in !',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'rohanvaghsiya4465@gmail.com',
        subject: 'Goodbye, Visit again !',
        text: `Goodbye, ${name}.We hope that you have a nice experience. If you okay with replay then tell us your experiance with the app.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}