const bcrypt = require('bcryptjs')

const login = async (req, res) => {
	const { email, password } = req.body
	const response = await req.app.get('db').users.find_user(email)
	const user = response[0]
	if (!user) {
		res.status(401).json("Username or password is incorrect")
	} else {
		const foundUser = await bcrypt.compare(password, user.hash)
		if (!foundUser) {
			res.status(401).json("Username or password is incorrect");
		} else {
			req.session.user = {
				user_id: user.user_id,
				email: user.email,
				name: user.name,
				profilepic: user.profilepic
			}
			res.status(200).json(req.session.user)
		}
	}
}

const register = async (req, res) => {
	try {
		const { email, name, password } = req.body
		const hash = await bcrypt.hash(password, 12)
		const response = await req.app.get('db').users.create_user(email, name, hash)
		const user = response[0]
		req.session.user = {
			user_id: user.user_id,
			email: user.email,
			name: user.name,
			profilepic: user.profilepic
		}
		console.log('user created:', req.session.user)
		res.status(200).json(req.session.user)
	} catch (e) {
		console.log('e', e)
		res.status(500).json("There is already an account registered with this email.")
	}
}

const logout = (req, res) => {
	req.session.destroy()
	console.log('logged out')
	res.sendStatus(200)
}

const auth = (req, res) => {
	if (!req.session.user) {
		res.sendStatus(401)
	} else {
		res.status(200).json(req.session.user)
	}
}

const deleteUser = (req, res) => {
	req.app.get('db').users.delete_user(req.session.user.user_id)
	.then(()=>{
		req.session.destroy()
		res.sendStatus(200)
	})
	.catch(err=>console.log(err))
}

const updatePicture = (req,res) => {
	req.app.get('db').users.update_picture([req.body.picture, req.session.user.user_id]).then(response=>{console.log(response[0])||res.status(200).json(response[0])}).catch(err=>console.log('updateerror',err))
}

module.exports = {
	login,
	register,
	logout,
	auth,
	deleteUser,
	updatePicture
}
