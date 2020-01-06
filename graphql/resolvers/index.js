const bookingResolver = require('./booking');
const eventResolver = require('./event');
const authResolver = require('./auth');

const rootResolver = {
    ...bookingResolver,
    ...eventResolver,
    ...authResolver
}
module.exports = rootResolver;