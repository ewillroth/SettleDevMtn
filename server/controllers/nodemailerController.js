const nodemailer = require("nodemailer");

async function sendInvite(req, res) {
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: process.env.NODEMAILER_ACCOUNT,
			pass: process.env.NODEMAILER_PASS
		}
	});

	let mailOptions = {
		from: `"Settle Admin" <${process.env.NODEMAILER_ACCOUNT}>`, // sender address
		to: `${req.body.email}`, // list of receivers
		subject: `You have been invited to a Settle!`, // Subject line
		text: `You have been invited to a Settle!  ${req.body.link}`, // plain text body
		html: `<p>You have been invited to a <a href= ${req.body.link}>Settle!</a></p>` // html body
	};
	
	// send mail with defined transport object
	await transporter.sendMail(mailOptions)
}

// sendInvite().catch(console.error);

module.exports = {
	sendInvite
}