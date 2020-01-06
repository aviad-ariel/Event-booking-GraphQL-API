const {
    buildSchema
} = require('graphql');

module.exports = buildSchema(`
        type Auth {
            _id: ID!
            token: String!
            tokenExpiration: Int!
        }

        type Booking {
            _id: ID!
            event: Event!
            user: User!
            createdAt: String!
            updatedAt: String!
        }

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            createdBy: User!
            bookedUsers: [User!]
        }

        type User {
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
        }

        input UserInput{
            email: String!
            password: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String
            createdBy: String
        }
          
        type RootQuery {
            events: [Event!]!
            userEvents: [Event!]!
            users: [User!]!
            bookings: [Booking!]!
            login(email: String! password: String!): Auth!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
            bookEvent(eventId: ID!): Booking!
            cancelBooking(bookingId: ID!): Event!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)