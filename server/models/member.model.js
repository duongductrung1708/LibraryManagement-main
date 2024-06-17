const mongoose = require('mongoose')
const memberSchema = new mongoose.Schema({
    memberName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    occupation: {
        type: String,
        required: false
    },
    nic: {
        type: Number,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    photoUrl: {
        type: String,
        required: false
    }
})

const Member = mongoose.model('Member', memberSchema)

module.exports = Member;