const config = require('../config/config.json');
const db = require('../models/index.js');
require('dotenv').config();

const { func, ref } = require('joi');



module.exports = {   
 saveStatus,
 listStatus,
 filterStatus
};

async function saveStatus(req) {

    const data = req.body;
    await db.fqc.create(data);
    return { status: 200,  message: 'QC Status saved successfully' };         

}

async function listStatus(req) {

    const statuses = await db.fqc.findAll();
    return { status: 200,  statuses:statuses };         

}

async function filterStatus(req) {

    const { filterBy, value } = req.query;

    if (!filterBy || !value) {
        return {status:400, message: 'Missing filterBy or value'};
    }

    const allowedFields = ['status'];
    if (!allowedFields.includes(filterBy)) {
        return {status:400, message: 'Invalid filter field'};
    }

    const statuses = await db.fqc.findAll({ where: { [filterBy]: value } });
    return { status: 200,  statuses:statuses };         

}
