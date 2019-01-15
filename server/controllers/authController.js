const bcrypt = require('bcryptjs')

const login = async (req, res) => {
	const { email, password } = req.body
	const response = await req.app.get('db').find_user(email)
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
		const response = await req.app.get('db').create_user(email, name, hash)
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
		res.status(500).json("email is already registered")
	}
}

const logout = (req, res) => {
	req.session.destroy()
	res.sendStatus(200)
}

const auth = (req, res) => {
	if (!req.session.user) {
		res.status(401).json('Please log in')
	} else {
		res.status(200).json(req.session.user)
	}
}

module.exports = {
	login,
	register,
	logout,
	auth
}