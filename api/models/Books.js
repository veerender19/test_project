const mongoose = require("mongoose");
const BookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim:true,
            require:true,
        },
        author: {
            type: String,
            trim: true,
            require:true,
        },
        isbn: {
            type: String,
            trim:true,
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
module.exports = mongoose.model("books", BookSchema);
