'use strict';

/******************************************************************************
 *                                Model Item                                  *
 ******************************************************************************
 *                                                                            *
 * This file contains the Item model. This model will be creted in the        *
 * database.                                                                  *
 *                                                                            *
 * An Item contain all information about an item/article of a advertisement.  *
 *                                                                            *
 * const mongoose: Contain the framework Mongoose (All his methods).          *
 * const userSchema: Schema for Item model in tha database.                   *
 * ****************************************************************************/

const mongoose = require('mongoose');
const itemSchema = mongoose.Schema({
    name: String,
    price: Number,
    photo: String,
    modifiedAt: Date,
    createdAt: Date
});

// Item model
const Item = mongoose.model('Item', itemSchema);

// Export Item model which will be available in the App
module.exports = Item;