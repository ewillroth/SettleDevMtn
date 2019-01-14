const create = (req, res) => {
	req.app.get('db').create_settle(req.body.user_id)
	.then(response=>{
		const settle = response[0]
		console.log(settle)
		res.status(200).json(settle)
	})
};

module.exports = {
	create
};
