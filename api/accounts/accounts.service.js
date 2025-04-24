

 const { Op } = require('sequelize');
const config = require('../config/config.json');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const db = require('../models/index.js');
const { attribute } = require('@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js');



module.exports = {   
    getAll,
    getAllClients,
    getAllVendors,
};



async function getAll() {
    // return await db.sequelize.query("select id from accounts where JSON_EXTRACT(bankingInfo, '$.account_no') = '1234567890'");
    // return await db.sequelize.query("select * from accounts where JSON_EXTRACT(bankingInfo, '$.account_no') = '2345678901'");
    // return await db.sequelize.query("select distinct * from accounts where json_search(bankingInfo,'all', '1234567890')",{
    //     type: db.sequelize.QueryTypes.SELECT
    // });

    return await db.accounts.findAll({
        // attributes:['legalName', 'billingInfo'],
    });


}

async function getAllClients() {
    return await db.accounts.findAll({
                where: {isClient:true}
             });

}


async function getAllVendors() {
    return await db.accounts.findAll({
                where: {isVendor:true}
             });

}






// async function getAll() {
//     const accountNo = '1234567890';

//     return await db.accounts.findAll({
//         where:{
//             bankingInfo:{
//                 [Op.contains]:[{
//                     account_no: accountNo
//                 }]
//             }
//         }
//     });
// }




// async function getAll() {
//     return await db.accounts.findAll({
//         // where: {isClient:true}
//     });
// }



// async function getAll() {
//     return await db.accounts.findAll({
//         where: {
//             contactInfo : {
//                 [Op.contains]: {city: 'chennai'}
//             }}
//     });
// }
