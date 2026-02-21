const mongoose = require('mongoose')


const noteSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    // Optional tags for filtering/search (stored as array of strings)
    tags: {
        type: [String],
        default: []
    },
    date:{
        type: Date,
        default: Date.now
    },
    user_id: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    }
},{
    timestamps: true
})


module.exports = mongoose.model('Notes', noteSchema)