const express = require('express');
const router = express.Router();
const fqcService = require('./fqc.service');
const validateRequest = require('../middleware/validate-request');
const Joi = require('joi');
const axios = require('axios');

router.post('/saveStatus', validateFQC, saveStatus);
router.get('/listStatus', listStatus);
router.get('/filterStatus', filterStatus);



function validateFQC(req, res, next){    
    const schema = Joi.object({
        timestamp:Joi.number().required(10),
        code: Joi.string().required(),
        status: Joi.string().required()
    });

    validateRequest(req, res, next, schema);
}


function saveStatus(req, res, next) {
    fqcService.saveStatus(req)
    .then((message) =>{    
        res.status(200).json( message )     
    })
    .catch(next);

}

function listStatus(req, res, next) {
    fqcService.listStatus(req)
    .then((message) =>{    
        res.status(200).json( message )     
    })
    .catch(next);

}

function filterStatus(req, res, next) {
    fqcService.filterStatus(req)
    .then((message) =>{    
        res.status(200).json( message )     
    })
    .catch(next);

}


module.exports = router;
