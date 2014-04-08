
module.exports = {

    tableName: 'user_profile',

    attributes: {

        id: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: false,
            foreignKey: true,
            references: 'user',
            on: 'id'
        },

        info: {
            type     : 'string'
        }

//        toJSON: function () {
//
//            var obj = this.toObject();
//
//            return {
//                username: obj.username,
//                role    : obj.role
//            };
//        }

    }

};