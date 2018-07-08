'use strict';

/******************************************************************************
 *                         Model Advertisement                                *
 ******************************************************************************
 *                                                                            *
 * This file contains the Advertisement model. This model will be creted in   *
 * the database.                                                              *
 *                                                                            *
 * An Advertisement contain all information of a advertisement.               *
 *                                                                            *
 * const mongoose: Contain the framework Mongoose (All his methods).          *
 * const userSchema: Schema for Advertisement model in tha database.          *
 * ****************************************************************************/

const mongoose = require('mongoose');
const User = require('./User');
const UserSchema = mongoose.SchemaTypes.ObjectId;
const Item = require('./Item');
const ItemSchema = mongoose.SchemaTypes.ItemSchema;


const advertisementSchema = mongoose.Schema({
    name: String,
    price: Number,
    photo: [String],
    sale: Boolean,
    tags: [String],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    datePublished: Date,
    modifiedAt: Date,
    createdAt: Date
});

advertisementSchema.index({price: 1, sale: 1, tags: 1, user: 1 });

advertisementSchema.statics.list = function(filter, skip, limit,fields,sort){
    // Create the query (It isn't ejecuted).
    const query = Advertisement.find(filter);
    query.skip(skip);
    query.limit(limit);
    query.select(fields);
    query.sort(sort);

    // Ejecute the query
    return query.exec();
}

// Advertisement model
const Advertisement = mongoose.model('Advertisement', advertisementSchema);

// Export Advertisement model which will be available in the App
module.exports = Advertisement;