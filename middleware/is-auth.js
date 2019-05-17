const jwt = require('jsonwebtoken');

/**
 * Middleware which checks for Auth header
 * and sets isAuth header to request
 */
module.exports = (req, res, next) => {

	const authHeader = req.get('Authorization');

	if (!authHeader) {
		req.isAuth = false;
		return next();
	}

	// if Auth header exists, try to get token from it
	const token = authHeader.split(' ')[1]; // [0]Breaer [1]tokensString123432
	if (!token || '' === token) {
		req.isAuth = false;
		return next();
	}

	let decodedToken;

	try {
		decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	} catch (err) {
		req.isAuth = false;
		return next();
	}

	if (!decodedToken) {
		req.isAuth = false;
		return next();
	}

	req.isAuth = true,
	req.userId = decodedToken.userId;
	return next();

}