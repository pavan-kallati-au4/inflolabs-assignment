const Profile = require('../../models/profile');
let { v4: uuid } = require('uuid');

module.exports = {

    Query: {

    },

    Mutation: {

        createProfile: async function (parent, { username, displayName, email }) {
            const userId = uuid();
            console.log(userId)
            const profile = await Profile.create({userId, username, displayName, email });
            const result = await profile.save()
            if (!result) return false;
            return true;
        }
    },

};