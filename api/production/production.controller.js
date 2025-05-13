const express = require('express');
const router = express.Router();
const productionService = require('./production.service');
const validateRequest = require('../middleware/validate-request');
const Joi = require('joi');
const axios = require('axios');
const mqtt = require('mqtt');


// router.post('/saveStatus', validateFQC, saveStatus);
// router.get('/listStatus', listStatus);
router.get('/listProductionData', listProductionData);

router.get('/filterProductionData', filterProductionData);

module.exports = router;

const mqttBrokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const mqttClient = mqtt.connect(mqttBrokerUrl);

const qrTopic = process.env.MQTT_QR_TOPIC || 'mqtt/kh/demo';
const statusTopic = process.env.MQTT_STATUS_TOPIC || 'status';

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe([qrTopic, statusTopic], (err) => {
    if (err) {
      console.error('MQTT subscribe error:', err);
    }
  });
});

mqttClient.on('message', (topic, message) => {

    saveProductionData(topic,message);
    
});

function saveProductionData(topic, payload){
    productionService.saveProductionData(topic,payload)
        .then((message) =>{    
            console.log(message)
        });
        // .catch(next);
    
}


function listProductionData(req, res, next) {
  productionService.listProductionData(req)
    .then((message) =>{    
        res.status(200).json( message )     
    })
    .catch(next);

}

function filterProductionData(req, res, next) {
  productionService.filterProductionData(req)
    .then((message) =>{    
        res.status(200).json( message )     
    })
    .catch(next);

}