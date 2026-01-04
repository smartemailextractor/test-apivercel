const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { uuid } = require("uuidv4");

const UnsubscribeListSchema = new Schema(
    {
        userid: {
            type: String,
        },
        email: {
            type: String,
        },
        trackingid: {
            type: String,
        },
    },
    { timestamps: true }
);

const UnsubscribeList = mongoose.model("UnsubscribeList", UnsubscribeListSchema);
module.exports = UnsubscribeList;
