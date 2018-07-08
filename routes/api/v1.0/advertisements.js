'use strict';

const express = require('express');
const router = express.Router();

const Advertisement = require('../../../models/Advertisement'); 
const jwtAuth = require('../../../lib/jwtAuth');

// Get all advertisiments or advertisements filtered
router.get('/',jwtAuth(), async (req, res, next)=>{
    try{
        Advertisement.collection.getIndexes({full: true}).then(indexes => {
            console.log("indexes:", indexes);
            
        }).catch(console.error);
        // Get the param or params for do the query
        const name = req.query.name;
        const tag = req.query.tag;
        const sale = req.query.sale;
        const price = req.query.price;
        const maxprice = req.query.maxprice;
        const minprice = req.query.minprice;
        const user = req.query.user;
        const skip = parseInt(req.query.skip);
        const limit = parseInt(req.query.limit);
        const fields = req.query.fields;
        const sort = req.query.sort; // La ordenación se ejecuta antes que el paginado.

        // Empty filter
        const filter = {};
        
        // The filter is added only when is necesary filter
        if(name){ 
            filter.name = new RegExp('^' + name, "i"); //Filter by name
        }

        if(tag){
            filter.tags = tag; //Filter by tag
        }
        if(sale){
            filter.sale = sale; //Filter by sale o search
        }

        if(price){
            filter.price = price; //Filter by price
        }

        if(maxprice && minprice){ //Filter price between min price and max price (both included).
            filter.price = {$gte: minprice, $lte: maxprice};
        }
        if(maxprice){ //Filter price less than maxprice included
            filter.price = {$lte: maxprice};
        }if(minprice){ //Filter price morte than minprice included
            filter.price = {$gte: minprice};
        }
        
        if(user){ //Filter by user
            filter.user = user; 
        }

        //const agentes = await Agente.list(filter);  // await espera a que se resuelva la promsea y me da el resultado.
        const advertisements = await Advertisement.list(filter, skip, limit, fields,sort);
        res.json({success: true, result: advertisements});
    }catch(err){
        next(err);
    }
});

module.exports = router;