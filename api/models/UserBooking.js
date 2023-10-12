const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BookSchema = mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
            require:true
        },
        book: {
            type: Schema.Types.ObjectId,
            ref: "books",
            require:true
        },
        quantity:{
            type: Number,
            trim:true,
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
BookSchema.index({ author: -1 });
module.exports = mongoose.model("userbookings", BookSchema);
