const Event = require('./../models/Event')
const User = require('./../models/User')
const {
    dateToString
} = require('./../helpers/date');

const populateEvents = async eventsId => {
    try {
        const events = await Event.find({
            _id: {
                $in: eventsId
            }
        });
        return events.map(event => {
            return transformEvent(event);
        });
    } catch (err) {
        throw err;
    }
};

const populateSingleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (err) {
        throw err
    }
};

const populateUser = async userId => {
    try {
        const user = await User.findById(userId);
        return transformUser(user)
    } catch (err) {
        throw err
    }
};

const populateUsers = async usersIds => {
    try {
        const users = await User.find({
            _id: {
                $in: usersIds
            }
        });
        return users.map(user => {
            return transformUser(user);
        });
    } catch (err) {
        throw err
    }
};


const transformEvent = event => {
    return {
        ...event._doc,
        createdBy: populateUser.bind(this, event.createdBy),
        date: dateToString(event._doc.date),
        bookedUsers: populateUsers.bind(this, event.bookedUsers)
    }
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: populateUser.bind(this, booking._doc.user),
        event: populateSingleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    }
}

const transformUser = user => {
    return {
        ...user._doc,
        createdEvents: populateEvents.bind(this, user.createdEvents),
        password: null
    }
}

module.exports = {
    transformEvent,
    transformBooking,
    transformUser
};