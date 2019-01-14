const create = (req, res) => {
	req.app.get('db').create_settle(req.body.user_id)
	.then(response=>{
		const settle = response[0]
		console.log(settle)
		res.status(200).json(settle)
	})
};

const getSettle = (req,res) => {
	req.app.get('db').get_settle(req.params.id)
	.then(response=>{
		const settle = response[0]
		console.log(settle)
		res.status(200).json(settle)
	})
}

const addSuggestions = (req,res) => {
	req.app.get('db').add_suggestions([req.body.user_id, req.params.id, req.body.suggestion1, req.body.suggestion2, req.body.suggestion3])
	.then(response=>{
		console.log(response)
	})
}

module.exports = {
	create,
	getSettle,
	addSuggestions
};
