const create = (req, res) => {
	req.app.get('db').settles.create_settle(req.session.user.user_id)
	.then(response=>{
		const settle = response[0]
		res.status(200).json(settle)
	})
};

const getSettle = (req,res) => {
	req.app.get('db').settles.get_settle(req.params.id)
	.then(response=>{
		const settle = response[0]
		res.status(200).json(settle)
	})
}

const updateStage = (req,res) => {
	req.app.get('db').settles.update_status([req.body.status,req.params.id])
	.then(response=>res.status(200).json(response))
}

const addUser = (req,res) => {
	req.app.get('db').settles.add_user_to_settle([req.session.user.user_id,req.params.id])
	.then(response=>res.status(200).json(response))
	.catch(err=>console.log('user already added to settle'))
}

const getParticipants = (req,res) => {
	req.app.get('db').settles.get_participants(req.params.id)
	.then(response=>{
		res.status(200).json(response)
	})
	.catch(err=>console.log(err))
}

module.exports = {
	create,
	getSettle,
	updateStage,
	addUser,
	getParticipants
};
