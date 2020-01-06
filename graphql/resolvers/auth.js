const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const {
    transformUser
} = require('./../../helpers/merge');
const { credentialCheck, duplicateCheck } = require('./../../helpers/auth');
const jwt = require('jsonwebtoken');

module.exports = {
    users: async () => {
        try {
            const users = await User.find();
            return users.map(user => {
                return transformUser(user)
            });
        } catch (err) {
            console.log(err);
            throw err
        }
    },
    createUser: async args => {
        try {
            const email = args.userInput.email;
            duplicateCheck(await User.findOne({email}));
            const salt = await bcrypt.genSalt(12);
            const hashed = await bcrypt.hash(args.userInput.password, salt);
            const user = new User({
                email: email,
                password: hashed
            });
            return transformUser(await user.save());
        } catch (err) {
            throw err
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({email: email});
        const isEqual = bcrypt.compare(password, user.password);
        credentialCheck(user && isEqual);
        const token = jwt.sign({userId: user.id, email: user.email}, 'SecretKey', {expiresIn: '50m'});
        return{
            _id: user.id,
            token: token,
            tokenExpiration: 50 
        }
    }
}