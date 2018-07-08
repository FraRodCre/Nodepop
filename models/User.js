'use strict';

/******************************************************************************
 *                                Model User                                  *
 ******************************************************************************
 *                                                                            *
 * This file contains the User model. This model will be creted in the        *
 * database.                                                                  *
 *                                                                            * 
 *  An User contain all information about an user of a advertisement.         *
 *                                                                            *
 * const mongoose: Contain the framework Mongoose (All his methods).          *
 * const userSchema: Schema for User model in tha database.                   *
 * ****************************************************************************/

const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: String,
    firstSurname: String,
    secondSurname: String,
    birthday: Date,
    country: String,
    province: String,
    city: String,
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    password: String,
    cypheredOptions: { type: JSON, hiden: true },
    modifiedAt: Date,
    createdAt: Date
});

userSchema.index({ email: 1 });

// Register user
userSchema.statics.register = function (name, email, password, cypheredOptions) {
    const query = User.create({ name: name, email: email, password: password, cypheredOptions: cypheredOptions });
    return query;

}
// Get list users
userSchema.statics.getUsers = function () {
    const query = User.find({});
    query.select('-password -cypheredOptions');
    return query.exec();
}

// Get an user
userSchema.statics.getUser = function (email) {
    const query = User.findOne({ email: email });
    query.select('-password -cypheredOptions');
    return query.exec();
}


// User model
const User = mongoose.model('User', userSchema);

// Export User model which will be available in the App
module.exports = User;