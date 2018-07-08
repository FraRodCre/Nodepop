'use strict';

/******************************************************************************
 *                         Connection database MongoDB                        *
 ******************************************************************************
 *                                                                            *
 * This file contains the configuration for connection databse                *
 *                                                                            *
 * Database name: nodeapi                                                     *
 * Database type: MongoDB                                                     *
 * ****************************************************************************/

const mongoose = require('mongoose');
const connectionMongoDB = mongoose.connection;

// Check if there is error when connecting whit MongoDB(server).
connectionMongoDB.on('error', err =>{
    console.log('Error connection to MongoDB', err);
});

// Open a single instance of the database and show by console what database is connected (open).
connectionMongoDB.once('open', ()=>{
    console.log('Connected to MongoDB in database:', connectionMongoDB.name, ',' , connectionMongoDB.host + ':' + connectionMongoDB.port + '.');
});

// Create connection to nodepop database. If database nodepop not exist, it's created automatically.
mongoose.connect('mongodb://localhost/nodepop');

module.exports = connectionMongoDB;
