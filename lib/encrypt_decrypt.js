'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const settings = require('../settings');

// Encryption and decryption key
const cipherKey = crypto.randomBytes(32);
// Initialization vector for generate the decryption key 
const initializationVector = new Buffer(crypto.randomBytes(16));

function encryptData(textToEncryp){
    
    // Cipher text
    const cipher = crypto.createCipheriv('aes256', cipherKey, initializationVector);
    
    // Text encrypted with AES-256
    let encrypted = cipher.update(textToEncryp,'utf8','hex');
    encrypted += cipher.final('hex');
    const result = {key:cipherKey, iv:initializationVector, encrypted:encrypted}

    return result;
}

function decryptData(textToDrecrypt, cypherKey, initVector){
    
    // Decipher text
    const decipher = crypto.createDecipheriv('aes256', cypherKey,initVector);
    let decrypted = decipher.update(textToDrecrypt, 'hex','utf8');
    decrypted += decipher.final('utf8');

    return decrypted;

}

function createDataHash(data){
    const hash = crypto.createHash('sha256');
    hash.update(data);

    return hash.digest('base64');
}

async function authentication(User,email,password){
    try {
        
        // Get user from database
        const userSave  = await User.findOne({email: email}).exec();
        
        //console.log('Usuario guardado:', userSave)

        // Check if exist the user
        if(!userSave){
            const res = {succes: false, message: 'Invalid credentials'};
            //console.log('Usuario no guardado:', res)
            return res;
        }

        // Buffers with buffer cyphered key and buffer initialization vector.
        const key = Buffer.from(userSave.cypheredOptions.key.buffer);
        const iv = Buffer.from(userSave.cypheredOptions.iv.buffer);
        
        // Decryted password
        const passwordDecrypt = decryptData(userSave.password, key, iv);
        
        // Check if password is correct, a token (JWT) is created.
        if(password !== passwordDecrypt){
            const res =  {succes: false, message: 'Invalid credentials'};
            return res;
        }
        
        // The token(JWT) of the user
        const token = jwt.sign({user_id: userSave._id}, settings.jwt.secret,
                              {expiresIn: settings.jwt.expiresIn});
        const res = {succes: true, result:token}

        return res ;
    } catch (error) {
           console.log(error); 
    }
}

module.exports.encryptData = encryptData;
module.exports.decryptData = decryptData;
module.exports.createDataHash = createDataHash;
module.exports.authentication = authentication;

