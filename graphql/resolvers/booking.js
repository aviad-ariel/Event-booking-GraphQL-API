const { transformBooking, transformEvent } = require("./../../helpers/merge");
const Booking = require("./../../models/Booking");
const Event = require("./../../models/Event");
const {
  authenticationCheck,
  authorizationCheck
} = require("./../../helpers/auth");

module.exports = {
  bookings: async (args, req) => {
    authenticationCheck(req.isAuth);
    try {
      const booking = await Booking.find({ user: req.userId });
      return booking.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    authenticationCheck(req.isAuth);
    try {
      const fetchedEvent = await Event.findById(args.eventId);
      const booking = new Booking({
        event: fetchedEvent,
        user: req.userId
      });
      fetchedEvent.bookedUsers.push(req.userId);
      await fetchedEvent.save();
      const res = await booking.save();
      return transformBooking(res);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    authenticationCheck(req.isAuth);
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      authorizationCheck(req.userId == booking.user);
      await Booking.deleteOne({ _id: args.bookingId });
      await Event.updateOne(
        { _id: booking.event },
        { $pull: { bookedUsers: req.userId } }
      );
      return transformEvent(await Event.findById(booking.event));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
