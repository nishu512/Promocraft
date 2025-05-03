const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    age: {
        type: Number
    },
    status: {
        type: Boolean,
        default: true
    },
    roleId: {
        type: Schema.Types.ObjectId, //batugasoijkadsasiksaj
        ref: "roles"
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    contactNo: {
        type: String
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"] // Enum to restrict values
    }
});

module.exports = mongoose.model("users", userSchema);
