const { searchByKeyword } = require("../../data/search");

module.exports = {

    Query: {
        search(_, args) {
            return searchByKeyword(args);
        }
    },

    SearchUnion: {
        __resolveType(obj) {
            if (obj.username) {
                return 'User';
            } 
            else if (obj.admin) {
                return 'Group';
            }
            else if (obj.owner) {
                return 'Page';
            }
            return null;
        },
    }
}