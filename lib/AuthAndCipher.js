'use strict';

/******************************************************************************
 *                               AuthAndCipher                                *
 ******************************************************************************
 *                                                                            *
 * This file contains methods for encrypt and decrypt text(password), create  *
 * hash and check if a token (JWT) is valid.                                  *
 *                                                                            * 
 *                                                                            *
 * const crypto: Contain the library Crypto with methods of cipher.           *
 * const jwt: Contains the library Json Web Token.                            *
 * const settings: Contains the config necessary for generate a token (JWT).  *
 * const cipherKey: It's the cipher key necessary for encrypt a text(password)*
 * const initializationVector: It's the initialization vector necessary for   *
 * create the ciphered.                                                       *
 * ****************************************************************************/

// Imports
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const settings = require('../settings');

// Encryption and decryption key
const cipherKey = crypto.randomBytes(32);
// Initialization vector for generate the decryption key 
const initializationVector = new Buffer(crypto.randomBytes(16));

/******************************************************************************
 *                       encryptData(textToEncryp)                            *
 ******************************************************************************
 * This method receive a text(password) and return encrypted password.        *
 *                                                                            * 
 * @param textToEncryp: Text for encrypt(password).                           *
 * @returns: JSON with cyphered options (Cyphered key, Initialization vector, *
 * encrypted password).                                                       *
 * ****************************************************************************/

function encryptData(textToEncryp){
    
    // Cipher text
    const cipher = crypto.createCipheriv('aes256', cipherKey, initializationVector);
    
    // Text encrypted with AES-256
    let encrypted = cipher.update(textToEncryp,'utf8','hex');
    encrypted += cipher.final('hex');
    // JSON with Ciphrered Key, initialization vector and  ciphered password.
    const result = {key:cipherKey, iv:initializationVector, encrypted:encrypted}

    return result;
}

/******************************************************************************
 *           decryptData(textToDrecrypt, cypherKey, initVector)               *
 ******************************************************************************
 * This method receive @param textToDecrypt, @param cypherKey and             *
 * @param initVector and return the text decrypted                            * 
 *                                                                            *
 * @param textToDecrypt: Text for encrypt(password).                          *
 * @param cypherKey: The same cyphered key used for encrypt the text          *
 * @param initVector: Initialization vector for decrypt text(password).       *
 * @returns:  @param textToDecrypt decrypted                                  *
 * ****************************************************************************/

function decryptData(textToDrecrypt, cypherKey, initVector){
    
    // Decipher text
    const decipher = crypto.createDecipheriv('aes256', cypherKey,initVector);
    let decrypted = decipher.update(textToDrecrypt, 'hex','utf8');
    decrypted += decipher.final('utf8');

    return decrypted;

}

/******************************************************************************
 *                           createDataHash(data)                             *
 ******************************************************************************
 * This method receive a data (password for example) and return his HASH.     *
 *                                                                            *
 * @param data: Text for create HASH                                          *
 * @returns:  Hash of @param data                                             *
 * ****************************************************************************/

function createDataHash(data){
    const hash = crypto.createHash('sha256');
    hash.update(data);

    return hash.digest('base64');
}

/******************************************************************************
 *                    authentication(User,email,password)                     *
 ******************************************************************************
 * This method receive @param User (Instance of model), @param email and      *
 * @param password and check if the credentials are valid. It's correct       * 
 * return a token(JWT) validate for 2days                                     *
 *                                                                            *
 * @param User: Instance of the User model.                                   *
 * @param email: Email of user to login                                       *
 * @param password: Password of user to login.                                *
 * @returns:  Token (JWT) for check the login is register.                    *
 * ****************************************************************************/
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
        const token = await jwt.sign({user_id: userSave._id}, settings.jwt.secret,
                              {expiresIn: settings.jwt.expiresIn});
        const res = {succes: true, token:token}

        return res ;
    } catch (error) {
           console.log(error); 
    }
}

/******************************************************************************
 *                                 jwtAuth()                                  *
 ******************************************************************************
 * Check if the token(JWT) is valid. It's valid pass the next middleware.     *
 *                                                                            *
 * ****************************************************************************/
// Check token (JWT)
function jwtAuth(){
    return (req, res, next) => {
        // Recoger el token de la petición
        const token = req.body.token || req.query.token || req.get('x-access-token');

        // Si no hay token respondo 'no autorizado'
        if(!token){
            const err = new Error('No token provided');
            err.status = 401;
            next(err);
            return;
        }

        // Verify the token (JWT) and pass to next Middleware(Controller)
        jwt.verify(token, settings.jwt.secret, (err, decoded) =>{
            if(err){
                err.status = 401;
                next(err);
                return;
            }

            req.user_id = decoded.user_id
            next();
        });
    };
};

// Export methods
module.exports.encryptData = encryptData;
module.exports.decryptData = decryptData;
module.exports.createDataHash = createDataHash;
module.exports.authentication = authentication;
module.exports.jwtAuth = jwtAuth;

