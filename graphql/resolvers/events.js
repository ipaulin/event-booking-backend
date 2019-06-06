const Event = require( '../../models/event' );
const User = require( '../../models/user' );
const { eventFormat } = require( './merge' );

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();
			return events.map( event => {
				return eventFormat( event );
			} );
		} catch ( err ) {
			throw err;
		}
	},
	createEvent: async ( args, req ) => {
		if ( ! req.isAuth ) {
			throw new Error( 'Unauthenticated' );
		}
		const event = new Event( {
			title: args.inputEvent.title,
			description: args.inputEvent.description,
			price: args.inputEvent.price,
			date: new Date( args.inputEvent.date ),
			creator: req.userId,
		} );
		let createdEvent;
		try {
			const eventResult = await event.save();

			createdEvent = eventFormat( eventResult );
			const userFindResult = await User.findById( req.userId );
			if ( ! userFindResult ) {
				throw new Error( 'User not found' );
			}

			userFindResult.createdEvents.push( event );
			await userFindResult.save();

			return createdEvent;
		} catch ( err ) {
			throw err;
		}

	},
};
