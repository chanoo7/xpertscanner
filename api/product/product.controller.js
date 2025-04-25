const express = require('express');
const router = express.Router();
const productService = require('./product.service.js');
const axios = require('axios');



router.get('/summary', listSummary);
router.get('/lines/:lineId/stations', listLines);


module.exports = router;


//console.log(router.stack.map(r => r.route && r.route.path)); 


function listSummary(req, res, next) {
  productService.listSummary(req)
        .then(data => res.json(data))
        .catch(next);

}

function listLines(req, res, next) {
  productService.listLines(req) // ✅ Pass 'req' here
    .then(params => res.json(params))
    .catch(next);
}
