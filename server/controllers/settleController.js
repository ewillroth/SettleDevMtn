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

const addSuggestions = (req,res) => {
	req.app.get("db").settles.add_suggestions([req.session.user.user_id, req.params.id, req.body.suggestion])
		.then(()=>{
			req.session.user.donesubmitting=true
			res.status(200).json(req.session.user)
		})
		.catch(err => res.status(403).json("Someone else has already submitted the same suggestion. No duplicates!"));
}

const removeSuggestion = (req,res) => {
	const db = req.app.get('db')
	db.settles.remove_suggestion([req.body.suggestion, req.params.id])
	.then(()=>{
		console.log('suggestion removed')
		db.settles.get_participants(req.params.id).then(response=>{
			const participants = response.map((e,i)=>{return e.user_id})
			const i = participants.indexOf(req.body.activeuser)
			if(participants[+i+1]){
				db.settles.assign_active(participants[+i+1], req.params.id)
				res.status(200).json(participants[+i+1])
			} else {
				db.settles.assign_active(participants[0], req.params.id)
				res.status(200).json(participants[0])
			}
		}).catch(err=>console.log(err))
	})
	.catch(err=>console.log(err))

}

const getSuggestions = (req,res) => {
	req.app.get('db').settles.get_suggestions([req.params.id])
	.then(response=> res.status(200).json(response))
	.catch(err=>console.log(err))
}

const getUserSuggestions = (req,res) => {
	req.app.get('db').settles.get_user_suggestions([req.session.user.user_id,req.params.id])
	.then(response=>res.status(200).json(response))
	.catch(err=>console.log(err))
}

const beginSettle = (req,res) => {
	const db = req.app.get('db')
	db.settles.update_status(['active', req.params.id])
	db.settles.get_participants(req.params.id).then(response=>{
		let random = Math.floor(Math.random() * response.length)
		db.settles.assign_active([response[random].user_id, req.params.id])
		.then(response=>{
			console.log('starting player', response)
			res.status(200).json(response[0].activeuser)
		})
	}).catch(err=>console.log(err))
	
}

const doneSubmitting = (req,res) => {
	req.app.get('db').settles.done_submitting([req.session.user.user_id, req.params.id])
	.then(()=>res.sendStatus(200))
	.catch(err=>console.log(err))
}

const recordWinner = (req,res) => {
	req.app.get('db').settles.record_winner([req.body.winner,req.body.winnerId,req.params.id])
	.then(()=>{res.sendStatus(200)})
	.catch(err=>console.log(err))
}

const deleteSuggestion = (req,res) => {
	req.app.get('db').settles.remove_suggestion([req.body.suggestion, req.params.id])
	.then(()=>res.sendStatus(200))
	.catch(err=>console.log(err))
}

const checkIfDone = (req,res) => {
	req.app.get('db').settles.check_if_done([req.params.id,req.session.user.user_id])
	.then((response)=>console.log(response)||res.status(200).json(response))
	.catch(err=>console.log(err))
}

const notDoneSubmitting = (req,res) => {
	req.app.get('db').settles.not_done_submitting([req.session.user.user_id, req.params.id])
	.then(() => res.sendStatus(200))
	.catch(err => console.log(err))
}

module.exports = {
	create,
	getSettle,
	updateStage,
	addUser,
	getParticipants,
	addSuggestions,
	removeSuggestion,
	getSuggestions,
	getUserSuggestions,
	beginSettle,
	doneSubmitting,
	recordWinner,
	deleteSuggestion,
	checkIfDone,
	notDoneSubmitting
};
