const Booking = require( '../../models/booking' );
const Event = require( '../../models/event' );
const { transformBooking, eventFormat } = require( './merge' );

module.exports = {
	bookings: async ( args, req ) => {
		if ( ! req.isAuth ) {
			throw new Error( 'Unauthenticated' );
		}
		try {
			const bookings = await Booking.find( { user: req.userId } );
			console.log( bookings );
			return bookings.map( booking => {
				return transformBooking( booking );
			} )
		} catch ( err ) {
			console.log( err );
			throw err;
		}
	},
	bookEvent: async ( args, req ) => {
		if ( ! req.isAuth ) {
			throw new Error( 'Unauthenticated' );
		}
		try {
			const fetchedEvent = await Event.findById( args.eventId );
			if ( ! fetchedEvent ) {
				throw new Error( 'Event not found' );
			}

			const booking = new Booking( {
				event: fetchedEvent,
				user: req.userId,
			} );

			const result = await booking.save();
			return transformBooking( result );
		} catch ( err ) {
			throw err;
		}
	},
	cancelBooking: async ( args, req ) => {
		if ( ! req.isAuth ) {
			throw new Error( 'Unauthenticated' );
		}
		try {
			const booking = await Booking.findById( args.bookingId )
				.populate( 'event' );
			const event = eventFormat( booking.event );

			await Booking.deleteOne( { _id: args.bookingId } );
			return event;
		} catch ( err ) {
			throw err;
		}
	},
};
