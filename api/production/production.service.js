
const { defaults } = require('joi');
const config = require('../config/config.json');
const db = require('../models/index.js');
require('dotenv').config();
const { Op } = require('sequelize');

// const { func, ref } = require('joi');

const qrTopic = process.env.MQTT_QR_TOPIC || 'mqtt/kh/demo';
const statusTopic = process.env.MQTT_STATUS_TOPIC || 'status';


module.exports = {   
    saveProductionData,
    listProductionData,
    filterProductionData
};

async function findOrCreateRecord(Model, condition1, condition2, defaults) {
  try {
    const [record, created] = await Model.findOrCreate({
      where: {
        [Op.and]: [
          condition1,
          condition2,
        ],
      },
      defaults,
    });

    if (created) {
      // New record was created
      return { record, created };
    } else {
      // Existing record was found
      return { record, created };
    }
  } catch (error) {
    // Handle errors
    throw error;
  }
}


async function saveProductionData(topic, message){  

  let latestData = {
    stationId: null,
    timestamp: null,
    qr: null
  };

  try { 
    const payload = JSON.parse(message.toString());    

    latestData = {
      stationId : payload.stationId,    
      code : payload.qr,      
      timestamp: payload.timestamp
    }

    const condition1 = {timestamp: latestData.timestamp};
    const condition2 = {code: latestData.code};
    const defaults = {
      stationId : payload.stationId,    
      code : payload.qr,      
      timestamp: payload.timestamp
    };

    if (topic === qrTopic) {
      if(payload.qr.startsWith("F")){
        
        findOrCreateRecord(db.production, condition1, condition2, defaults)
        .then(({ record, created }) => {
          if (created) {
            console.log('New Record created:', record.toJSON());
          } else {
            console.log('Existing record found:', record.toJSON());
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
        
        // db.production.create(latestData)
        // return {message:"Success"}

      }
    } else if (topic === statusTopic) {
      // latestData.status = payload.status || latestData.status;
      //Do nothin
    }
    return {message:"message ignored"}
   
    // console.log(`Received MQTT data on topic [${topic}]:`, latestData);
   } catch (err) {
     console.error('Error parsing MQTT message:', err);
     return err;
   }
   

}


async function listProductionData(req) {

    const statuses = await db.production.findAll();
    return { status: 200,  statuses:statuses };         

}

async function filterProductionData(req) {

    const { filterBy, value } = req.query;

    if (!filterBy || !value) {
        return {status:400, message: 'Missing filterBy or value'};
    }

    const allowedFields = ['stationId', 'code'];
    if (!allowedFields.includes(filterBy)) {
        return {status:400, message: 'Invalid filter field'};
    }

    const statuses = await db.production.findAll({ where: { [filterBy]: value } });
    return { status: 200,  statuses:statuses };         

}
