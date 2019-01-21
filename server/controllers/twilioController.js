//Twilio
const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const phoneNumber = process.env.TWILIO_FROM_NUMBER;
const client = require("twilio")(accountSid, authToken);

const sendInvite = (req,res) => {
	client.messages
		.create({
			body: `Someone has invited you to a Settle! ${req.body.link}}`,
			from: phoneNumber,
			to: req.body.number
		})
		.then(message=>console.log(message.sid))
		.done();
}

module.exports = {
	sendInvite
}