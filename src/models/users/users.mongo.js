const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, 'Name must be provided' ],
        minLength: 3,
        maxLength: 25,
    },
    email: {
        type: String,
        required: [ true, 'Email must be provided' ],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Email must be valid'
        }
    },
    password: {
        type: String,
        required: [ true, 'Password must be provided' ],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    }
});

userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidate) {
    console.log(this);
    return await bcrypt.compare(candidate, this.password);
}

module.exports = mongoose.model('User', userSchema);