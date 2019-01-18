
const getSettles = (req,res) => {
	req.app.get('db').users.get_user_settles(req.session.user.user_id)
	.then(response=>{
		res.status(200).json(response)
	})
}

module.exports = {
	getSettles
}