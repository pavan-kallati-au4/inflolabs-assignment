module.exports = {
    Query: {
        getAllReportedPosts: async function (parent, { limit, skip }, context, info) {

            console.log("LIMIT", limit)
            console.log("SKIP", skip)
            console.log(parent)
            return [{ body: 'some post body' }]
        },
        getAllReportedProfiles: async function (parent, { limit, skip }, context, info) {
            console.log("LIMIT", limit)
            console.log("SKIP", skip)
            console.log(parent)
            return [{ username: 'some username' }]
        }
    }
}