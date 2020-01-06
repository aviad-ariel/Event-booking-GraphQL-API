const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const schema = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index');
const app = express();
const mongoose = require('mongoose');
const auth = require('./middleware/auth');
const cors = require('cors');

const startServer = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
            }@cluster0-3e6wc.mongodb.net/test?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        app.listen(process.env.PORT, () => {
            console.log(`Listen on port ${process.env.PORT}`);
        });
    } catch (err) {
        throw err
    };
};

app.use(bodyParser.json());

app.use(auth);

app.use(cors());

app.use('/graphql', graphqlHttp({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
}));

startServer();