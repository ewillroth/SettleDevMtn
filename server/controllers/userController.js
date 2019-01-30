
const getSettles = (req,res) => {
	req.app.get('db').users.get_user_settles(req.session.user.user_id)
	.then(response=>{
		res.status(200).json(response)
	})
}

const updateName = (req,res) => {
	req.app.get('db').users.update_name([req.session.user.user_id, req.body.name])
	.then(response=>{
		console.log(response)
		req.session.user.name = response[0].name
		res.status(200).json(response)
	})
	.catch(err=>console.log(err)||res.status(400).json(err))
}

const updateEmail = (req,res) => {
	req.app.get("db").users.update_email([req.session.user.user_id, req.body.email])
	.then(response=>{
		console.log(response)
		req.session.user.email = response[0].email
		res.status(200).json(response)
	})
	.catch(err=>console.log(err)||res.status(400).json(err))
}

const getStatsSuggested = (req,res) => {
	req.app.get('db').users.get_most_suggested(req.session.user.user_id)
	.then(response=>res.status(200).json(response[0]))
	.catch(err=>console.log(err))
}

const getStatsWinning = (req,res) => {
	req.app.get('db').users.get_most_winning(req.session.user.user_id)
	.then(response=>res.status(200).json(response[0]))
	.catch(err=>console.log(err))
}

const getStatsParticipated = (req,res) => {
	req.app.get('db').users.get_participated(req.session.user.user_id)
	.then(response=>res.status(200).json(response[0]))
	.catch(err=>console.log(err))
}

const updateSettles = (req,res) => {
	req.app.get('db').users.update_settles([req.body.email, req.session.user.user_id])
	.then(response=>res.sendStatus(200))
	.catch(err=>console.log(err))
}

module.exports = {
	getSettles,
	updateEmail,
	updateName,
	getStatsSuggested,
	getStatsWinning,
	getStatsParticipated,
	updateSettles
}