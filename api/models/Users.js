const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            trim:true,
            require:true,
        },
        email: {
            type: String,
            trim: true,
            require:true,
            unique: true
        },
        password: {
            type: String,
            require:true
        },
        status:{
            type: Number,
            enum: [1, 2, 3], //1->active, 2->block, 3->delete
            default: 1
        }
    },{
        timestamps: true
});
UserSchema.index({ username: -1 });
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});
UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};
module.exports = mongoose.model("users", UserSchema);
