'use strict';

/*********************************************************************************************************
 *                              Middleware/Controller for users                                          *
 *********************************************************************************************************
 *                                                                                                       *
 * This middleware contain all methods for process the users request from the client.                    *
 *                                                                                                       *
*********************************************************************************************************/

/*********************************************************************************************************
 *                                                Constants                                              *
 *********************************************************************************************************
 * express - Import framework express. Contain all methods of express.                                   *
 * router - It's the router for users. It's an isolated instance of middleware and routes.               *
 * User - It's an instance of User Model.                                                                *
 * encrypt - Contains all methods of file AuthAndCipher.js                                               *                                                                                                      *
 *********************************************************************************************************/
const express = require('express');
const router = express.Router();

const User = require('../../../models/User'); 
const encrypt = require('../../../lib/AuthAndCipher');

/****************************************** GET Methods **************************************************/

// Get an user by email
router.get('/:email', encrypt.jwtAuth(), async (req, res, next)=>{
    try{
        const email = req.params.email;
        const user = await User.getUser(email);

        res.json({success: true, result: user});
    }catch(err){
        next(err);
    }
});

// Get user list
router.get('/', encrypt.jwtAuth(), async (req, res, next)=>{
    try{
        
        const users = await User.getUsers();

        res.json({success: true, result: users});
    }catch(err){
        next(err);
    }
});

/****************************************** POST Methods **************************************************/

// Create user
router.post('/register', async (req, res, next) =>{

    try{
        // Options of cyphered.
        const cypheredOptions = encrypt.encryptData(req.body.password);
        // Encrypted password
        const pass = cypheredOptions.encrypted;
        // Cyphered key and initialization vector
        delete cypheredOptions.encrypted;

        const name = req.body.name;
        const email = req.body.email;

        
        // Register user
        const registeredUser = await User.register(name, email,pass,cypheredOptions);
        //Response
        res.json({success: true, result: registeredUser});
    }catch(err){
        next(err);
    }
});

// Login
router.post('/login', (req, res, next) =>{
    try {

        const email = req.body.email;
        const password = req.body.password;
        // Check if the user is authenticated, it's true return the token(JWT) else return error.
        encrypt.authentication(User,email,password).then(function (result){
            
            if(result.succes === false){
                const error = res.__('Error credentials');
                res.json({success: false, result: error});
            }
            res.json({result});
        });
        
    } catch (error) {
        next(error);
    }
});


module.exports = router;
