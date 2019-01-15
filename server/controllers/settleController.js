const create = (req, res) => {
	req.app.get('db').settles.create_settle(req.session.user.user_id)
	.then(response=>{
		const settle = response[0]
		console.log(settle)
		res.status(200).json(settle)
	})
};

const getSettle = (req,res) => {
	req.app.get('db').settles.get_settle(req.params.id)
	.then(response=>{
		const settle = response[0]
		console.log(settle)
		res.status(200).json(settle)
	})
}

const updateStage = (req,res) => {
	req.app.get('db').settles.update_status([req.body.status,req.params.id])
	.then(response=>res.status(200).json(response))
}

const addUser = (req,res) => {
	const db = req.app.get('db')
	const finduser = (obj) => {
		for (let k in obj) {
			if (obj[k] === req.session.user.user_id) {
				return true
			}
		}
	}
	db.settles.get_participants(req.params.id)
	.then(response=>{
		const participants = response[0]
		if(!finduser(participants)){
			db.settles.add_user_to_settle([req.session.user.user_id,req.params.id])
			.then(response=>console.log('user added to settle')||res.status(200).json(response))
		}
	})
}

const getParticipants = (req,res) => {
	req.app.get('db').settles.get_participants(req.params.id)
}

module.exports = {
	create,
	getSettle,
	updateStage,
	addUser,
	getParticipants
};
