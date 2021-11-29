const validator = require('validator')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: {
        type: Number,
        required: true,
        // validate(value) {
        //     if (!validator.isEmail(value)) {
        //         throw new Error('Email Not valid')
        //     }
        // },


    },
    size: { type: String, required: true },

})
module.exports = mongoose.model('Menu', menuSchema)

