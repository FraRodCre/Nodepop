'use strict';

const jwt = require('jsonwebtoken');
const localConfig = require('../settings');

// Check token (JWT)
module.exports = function(){
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
        jwt.verify(token, localConfig.jwt.secret, (err, decoded) =>{
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