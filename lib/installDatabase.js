'use strict';

/******************************************************************************
 *                            Install Database                                *
 ******************************************************************************
 *                                                                            *
 * This file contains the methods for install database with data contained in *
 * the file data.json.                                                        *
 *                                                                            * 
 * It's necessary the number of users be equal to the number of               *
 * advertisements because each advertisement will have an user assigned.      *
 *                                                                            *
 * const connectDB: Connection of the database (MongoDB).                     *
 * const filesSystem: Contain JavaScript library, fs. For read content of the *
 * the data.json                                                              *
 * const path: Contain JavaScript library, path. For get path of the file     *
 * data.json.                                                                 * 
 * const asyn:Contain JavaScript library, async. For do asynchronous          *
 * operations. (https://github.com/caolan/async)                              *                                                                *
 * const User: It's an instance of User model.                                * 
 * const Advertisement: It's an instance of Advertisement model.              *
 *                                                                            * 
 ******************************************************************************/

 // Connection Database (MongoDB)
 const connectDB = require('./connectionDatabase');
 // Import fs library
const filesSystem = require('fs');
// Import path library
const path = require('path');
// Import asycn library
const async = require('async');
// User model
const User = require('../models/User'); 
// Advertisement model
const Advertisement = require('../models/Advertisement'); 
// Methods for cypher and Authenticate
const encrypt = require('./AuthAndCipher');

// Encrypt password for users the data.json file.
function encryptPasswordUser(json){
    const users = json.users;
    async.forEachOf(users,(key,value) =>{
    
        const passEncrypted = encrypt.encryptData( key.password);
        key.password = passEncrypted.encrypted;
        delete  passEncrypted.encrypted;
        key.cypheredOptions = passEncrypted
    
    }, (err)=>{
        if(err){
            callback(err);
            return;
        }
    });
    return json;
}

/******************************************************************************
 *                        readDataJson(callback)                              *
 ******************************************************************************
 * This method receive a calbback and return a callback. This function is     *
 * Asynchronous.                                                              *
 *                                                                            * 
 * callback is function with to parameters, error and json to read.           *
 * callback = function(error, json);                                          *
 *                                                                            *
 * @param error: In case of error when proccessing the file, return the error.*
 * @param json: JSON object with the content of the file data.json. It's the  *
 * final result.                                                              *
 * ****************************************************************************/

function readDataJsonFile(callback){
    // Contain the path of data.json file.
    const dataJsonFile = path.join(__dirname,'/data.json');
    
    // Read the content the file passed by parameter(data.json)
    filesSystem.readFile(dataJsonFile, 'utf-8', (error, data) => {
        
        // Check if there are error when reading the file
        if(error){
            callback(error);
            return;
        }

        // Save JSON with data
        let jsonObject;
        
        try {
            // Parse json data and save in variable jsonObject.
            jsonObject = JSON.parse(data);
            
        } catch (error) {
            callback(error);
            return;
        }

        callback(null, jsonObject);
    });
}

/******************************************************************************
 *                        saveDataInDB(json)                                  *
 ******************************************************************************
 * This method receives a jsonObject with users and advertisements and they   *
 * are save in the database.                                                  *       
 *                                                                            *
 * @param json: JSON object with the content(User and Advertisements) of the  *
 * file data.json.                                                            *
 * ****************************************************************************/

function saveDataInDB(json){
    encryptPasswordUser(json);
    // Add Users in database
    User.insertMany(json.users,function (err,docsUsers){
        if (err){
           console.log(err);
            return;
        }
            console.log('Users adds correctly in the database.');
            
            // Walk the loop with users of database and add a user to a advertisement
            async.forEachOf(docsUsers,(key,value) =>{
                // Modify the users of the advertisements with the user save in the database. This is necesary for save
                //the advertisement in the database because the model User in model Advertisment need the _id atribute.
                json.advertisements[value].user = docsUsers[value];
        
            }, (err)=>{
                if(err){
                    callback(err);
                    return;
                }
            }); 
            // Add Advertisement in database
            Advertisement.insertMany(json.advertisements,function (err,docsAdvertisements){
                if (err){
                   console.log(err);
                    return;
                }
                console.log('Advertisements adds correctly in the database.');
                console.log('Installation of the database finished');
            });
        }
    );
}

// Clear collections in the database
connectDB.dropDatabase();

// Save data in the database.
readDataJsonFile((err, json) => {
    if (err) {
        console.error('Error: ', err);
        return;
    }
    saveDataInDB(json);
});