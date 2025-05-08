const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { func } = require('joi');
require('dotenv').config();

const db = require('../models/index.js');

// const authService  = require('../auth/auth.service.js')


// module.exports = generateRefreshToken;


function generateAccessToken(user) {
    return jwt.sign({ id: user.id, role: user.role, type: user.type }, process.env.JWT_ACCESS_SECRET, {
      // expiresIn: process.env.JWT_ACCESS_EXPIRATION,
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,

    });
  }
  
  // Generate Refresh Token
function generateRefreshToken(user) {
    return jwt.sign({ id: user.id, role: user.role, type: user.type }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });
}



function verifyToken(token, type) {
  let payload ="";
  let message ="";

  if(type=='access')  var secret = process.env.JWT_ACCESS_SECRET;
        
  if(type=='refresh') var secret = process.env.JWT_REFRESH_SECRET;

  try{
    var decoded = jwt.verify(token, secret );    
    if(decoded.id ) return decoded;
  }catch(error){
        // Handle errors (invalid token, expired token, etc.)

        if (error.name === 'TokenExpiredError') {
          if(type == 'refresh'){
            blacklistToken(token,"refresh");
            payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET, {ignoreExpiration: true} );
            db.users.update({isLoggedin : false}, {where :{id : payload.id}});
          }

          console.error('Token expired');
          message = "Refresh Token Expired. Logged out from current session";

        } else {
          console.error('Invalid token:', error.message);
          message = "Refresh Token Invalid ";

        }
        return { status:403, message:message}
      }  
}

// Authenticate Access Token
async function authenticate(req, res, next){

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token required' });
  
    const blacklistedToken = await isBlackListed(token);

    if(blacklistedToken) {
      return res.status(403).json({ status: 403, message: 'token is blacklisted' }); //return { status:403, message: ' token is blacklisted' };
    } 

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (error, user) => {
      let message ="";
        if (error){
          console.log(error)
          if (error.name === 'TokenExpiredError') {
            console.error('Token expired');
            message = "Access Token Expired";
          } else {
            console.error('Invalid token:', error.message);
            message = "Access Token Invalid";
          }          
          return res.status(401).json({ status: 401, message: message});
        } 
        user.accessToken = token;
        req.user = user;
        next();
    });

}

//Verify User Role
// function checkRole(role){

//   // getRoleById();

//   return (req, res, next) => {
//     if (req.user.role != role) {
//       return res.status(403).json({ message: 'Access denied' });
//     }
//     next();
//   };

// }

function checkRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}


//Get User Contact Info
function getContacInfo(req,res, next){

  // req.id
  // return (req, res, next) => {
  //   if (req.user.role != role) {
  //     return res.status(403).json({ message: 'Access denied' });
  //   }
  //   next();
  // };
  next();

}


async function blacklistToken(token, type){
  console.log('inside blacklistToken')
  await db.blacklistedTokens.create({
      token: token,
      type:type
    },
    { fields: ['token', 'type'] },)
    .then(function(item){
      console.log('blacklisted')
      
    }).catch(function (err) {
      console.log(err)
    });         

}

async function isBlackListed(token){

    const blacklisted = await db.blacklistedTokens.findOne({ where:{ token : token}});
     
    if(blacklisted) return true;

    return false;
  
}




module.exports = { generateAccessToken, generateRefreshToken, verifyToken, authenticate, checkRole, getContacInfo, blacklistToken, isBlackListed};




// function verifyToken(token, type) {
//   try {

//     // const blacklisted = await db.blacklistedTokens.findOne({ where:{ token : token}});
//     // console.log('Hi '+blacklisted)
//     // if(blacklisted)
//     //   return { status:403, message:'Token is blacklisted'}
//     // jwt.verify method decodes the token and checks the signature
//     console.log(token + '-'  + type)

//     if(type=='access')
//         var decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

//     if(type=='refresh')
//       var decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

//     // If token is valid, return the decoded payload
//     // console.log("Decoded Token:", decoded);
//     console.log('Decoded : ' + decoded.id)
//     return decoded;
    
//   } catch (error) {
//     // Handle errors (invalid token, expired token, etc.)
//     if (error.name === 'TokenExpiredError') {
//       console.error('Token expired');
//     } else {
//       console.error('Invalid token:', error.message);
//     }
//     return { status:403, message:error}
//   }
  
// }