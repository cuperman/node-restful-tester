var restful = require('node-restful'),
    mongoose = restful.mongoose,
    Schema = mongoose.Schema;

    exports.UserSchema = Schema({
        name: {type: String},
        age: {type: Number},
        birthdate: {type: Date},
        binary: {type: Buffer},
        living: {type: Boolean},
        mixed: {type: Schema.Types.Mixed},
        spouse: {type: Schema.Types.ObjectId},
        array: [],
        ofString: [String],
        ofNumber: [Number],
        ofDates: [Date],
        ofBuffer: [Buffer],
        ofBoolean: [Boolean],
        ofMixed: [Schema.Types.Mixed],
        ofObjectId: [Schema.Types.ObjectId],
        nested: {
            stuff: { type: String }
        }
    });
    exports.User = restful.model('User', exports.UserSchema);
