const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );
const User = require( '../../models/user' );

module.exports = {
	createUser: async args => {
		try {
			const userFindResult = await User.findOne( { email: args.inputUser.email } );

			if ( userFindResult ) {
				throw new Error( 'User already exists' )
			}
			const hashedPass = await bcrypt.hash( args.inputUser.password, 12 );
			const user = new User( {
				email: args.inputUser.email,
				password: hashedPass,
			} );

			const userSaveResult = await user.save();
			return {
				...userSaveResult._doc,
				password: null,
			}

		} catch ( err ) {
			throw err;
		}
	},
	login: async ( { email, password } ) => {
		const errorMessage = 'Username or password incorect!';
		try {
			const user = await User.findOne( { email: email } );

			if ( ! user ) {
				throw new Error( errorMessage );
			}
			const result = await bcrypt.compare( password, user.password );

			if ( ! result ) {
				throw new Error( errorMessage );
			}

			const token = jwt.sign(
				{
					userId: user.id,
					email: user.email,
				},
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			);
			return {
				userId: user.id,
				token: token,
				tokenExpiration: 1,
			}
		} catch ( err ) {
			throw err;
		}
	},
};
