const express = require('express');
const router = express.Router();
const accountsService = require('./accounts.service');
// var parser = require('ua-parser-js');
const {authenticate } = require('../middleware/authFunctions.js')


// routes

router.get('/allaccounts', authenticate, getAll);
router.get('/allClients',authenticate,  getAllClients);
router.get('/allVendors',authenticate, getAllVendors);

module.exports = router;


function getAll(req, res, next) {
    accountsService.getAll()
        .then(users => res.json(users))
        .catch(next);
}


function getAllClients(req, res, next) {
    accountsService.getAllClients()
        .then(users => res.json(users))
        .catch(next);
}


function getAllVendors(req, res, next) {
    accountsService.getAllVendors()
        .then(users => res.json(users))
        .catch(next);
}
