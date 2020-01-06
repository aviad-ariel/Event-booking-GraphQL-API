const Event = require("../../models/Event");
const { transformEvent } = require("./../../helpers/merge");
const User = require("./../../models/User");
const { authenticationCheck } = require("./../../helpers/auth");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      console.log(err);
    }
  },
  userEvents: async (args, req) => {
    try {
      const events = await Event.find({ createdBy: req.userId });
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      console.log(err);
    }
  },
  createEvent: async (args, req) => {
    authenticationCheck(req.isAuth);
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: new Date().toISOString(),
      createdBy: req.userId,
      bookedUsers: []
    });
    try {
      const creator = await User.findById(req.userId);
      creator.createdEvents.push(event);
      console.log(event)
      event.bookedUsers.push(creator);
      await creator.save();
      const saved = await event.save();
      return transformEvent(saved);
    } catch (err) {
      console.log(err);
    }
  }
};
