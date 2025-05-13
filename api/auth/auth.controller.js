const express = require('express');
const router = express.Router();
const authService = require('./auth.service');
const validateRequest = require('../middleware/validate-request');
const Joi = require('joi');
const axios = require('axios');
const {authenticate, checkRole, getContacInfo, verifyToken } = require('../middleware/authFunctions.js')

const nodemailer = require('nodemailer');

// var parser = require('ua-parser-js');

// routes
router.post('/register',validateRegistration, authenticate, checkRole('su'), register);
router.post('/registerSU',validateRegistration,  registerSU);


router.post('/login', validateLogin, login);

// router.post('/login-by-otp', validateLogin, login-by-otp);

// router.post('/refreshToken',validateRefreshToken, refreshToken);
router.post('/logout', authenticate, logout);
router.post('/refreshToken', refreshToken);
router.post('/updateUser', authenticate, checkRole('su'), updateUser);
router.post('/updatePassword', validateUpdatePassword, authenticate, updatePassword);
router.post('/resetPassword', resetPassword);
router.post('/send-otp-email', sendOtpEmail);
router.post('/send-otp-sms', sendOtpSms);
router.post('/verify-otp', verifyOtp);


router.post('/enableUser', validateUser, authenticate,checkRole('su'), enableUser);
router.post('/disableUser', validateUser, authenticate,checkRole('su'), disableUser);

// router.get('/send-otp',authenticate,getContacInfo,sendOtp);
// router.get('/send-otp-by-sms',authenticate,getContacInfo,sendOtpBySMS);
// router.get('/send-otp-by-email',authenticate,getContacInfo,sendOtpByEmail);
// router.get('/verifyOtp',validateOtp,authenticate,getContacInfo,verifyOtp);

router.get('/listUsers',authenticate,checkRole(['admin', 'su']),  listUsers);


const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
const otpStore = new Map();
const crypto = require('crypto');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: "us2.smtp.mailhostbox.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter connection
let isTransporterReady = false;
transporter.verify((error, success) => {
  if (error) {
    console.error('Error setting up transporter:', error);
  } else {
    isTransporterReady = true;
    console.log('Transporter is ready to send emails');
  }
});



// const mqtt = require('mqtt');

// const mqttBrokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
// const mqttClient = mqtt.connect(mqttBrokerUrl);

// const qrTopic = process.env.MQTT_QR_TOPIC || 'mqtt/kh/demo';
// const statusTopic = process.env.MQTT_STATUS_TOPIC || 'status';

// let latestData = {
//   stationId: null,
//   timestamp: null,
//   qr: null,
//   status: null,
// };

// mqttClient.on('connect', () => {
//   console.log('Connected to MQTT broker');
//   mqttClient.subscribe([qrTopic, statusTopic], (err) => {
//     if (err) {
//       console.error('MQTT subscribe error:', err);
//     }
//   });
// });

// mqttClient.on('message', (topic, message) => {
//   try {
//     const payload = JSON.parse(message.toString());

//     if (topic === qrTopic) {
//       latestData = {
//         ...latestData,
//         stationId: payload.stationId || latestData.stationId,
//         timestamp: payload.timestamp || Date.now() / 1000,
//         qr: payload.qr || latestData.qr,
//       };
//     } else if (topic === statusTopic) {
//       latestData.status = payload.status || latestData.status;
//     }

//    // console.log(`Received MQTT data on topic [${topic}]:`, latestData);
//   } catch (err) {
//     console.error('Error parsing MQTT message:', err);
//   }
// });

// router.get('/api/mqtt-data', (req, res) => {
//   res.json(latestData);
// });


router.post('/send-otp', async (req, res) => {
    const { email, phone } = req.body;
  //console.log(req.body)
    if (!email && !phone) {
      return res.status(400).json({ error: 'Please provide either Email or Phone.' });
    }
  
    try {
      if (email) {
        await sendOtpEmail(req, res);
      } else if (phone) {
        await sendOtpSms(req, res);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ error: 'Failed to send OTP.' });
    }
  });
  



module.exports = router;


//console.log(router.stack.map(r => r.route && r.route.path)); 


async function sendOtpEmail(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const userVerification = await authService.verifyUser(email);
    if (userVerification.status !== 200) {
      return res.status(500).json({ error: userVerification.message });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + OTP_EXPIRY_TIME });
    console.log(`Generated OTP for ${email}:`, otp);

    if (isTransporterReady) {
      await transporter.sendMail({
        from: `Your App <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
      });
      return res.status(200).json({ message: 'OTP sent successfully' });
    }
    return res.status(500).json({ error: 'Failed to send email' });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return res.status(500).json({ error: 'Failed to send OTP email' });
  }
}

async function sendOtpSms(req, res) {
  const { phone } = req.body;
  if (!phone) return res.status(400).send({ error: 'Phone number is required.' });

  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore.set(phone, { otp, expiresAt: Date.now() + OTP_EXPIRY_TIME });
  //console.log(otpStore)
  try {
    await axios.get('http://loginsms.ewyde.com/rest/services/sendSMS/sendGroupSms', {
      params: {
        AUTH_KEY: process.env.SMS_AUTH_KEY,
        message: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
        senderId: 'EWTEST',
        routeId: 11,
        mobileNos: phone,
        smsContentType: 'english'
      }
    });
    res.status(200).send({ message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).send({ error: 'Failed to send OTP SMS' });
  }
}

function verifyOtp(req, res) {
    const { email, phone, otp } = req.body;
  
    // Ensure either email or phone is provided
    if (!email && !phone) {
      console.error('Missing Email or Phone Number');
      return res.status(400).send({ error: 'Email or Phone Number is required' });
    }
  
    if (!otp) {
      console.error('Missing OTP');
      return res.status(400).send({ error: 'OTP is required' });
    }
  
    // Determine identifier (either email or phone)
    const identifier = email || phone;
  
    // Check if OTP exists in store
    const otpData = otpStore.get(identifier);
    if (!otpData) {
      console.error('OTP not found for:', identifier);
      return res.status(400).send({ error: 'Invalid or expired OTP' });
    }
  
    // Check if OTP is expired
    if (otpData.expiresAt < Date.now()) {
      otpStore.delete(identifier);
      console.error('OTP expired for:', identifier);
      return res.status(400).send({ error: 'OTP has expired' });
    }
  
    // Validate OTP
    if (otpData.otp !== otp) {
      console.error('Incorrect OTP for:', identifier);
      return res.status(400).send({ error: 'Invalid OTP' });
    }
  
    // OTP is valid - remove from store and send success response
    otpStore.delete(identifier);
    console.log('OTP verified successfully for:', identifier);
    res.status(200).send({ message: 'OTP verified successfully' });
  }
  







function updateUser(req, res, next) {
    // Debug log to see the incoming request
    //console.log('Incoming Request:', req.body);

    // Ensure that the `updateUser` method is returning a promise
    authService.updateUser(req)
        .then(response => {
            // Log response for debugging
            //console.log('Response from updateUser:', response);

            // Return the response in JSON format
            res.status(response.status).json(response);
        })
        .catch(err => {
            console.error('Error:', err);
            next(err);  // Pass the error to the error-handling middleware
        });
}
  


function validateRegistration(req, res, next){
    
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().required(),
        type: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        type: Joi.string().required(),
        allowedClient: Joi.string().required()
    });

    validateRequest(req, res, next, schema);

}





function register(req, res, next) {

  authService.register(req)
  .then(response => res.status(response.status).json(response))
  .catch(next);

}

function registerSU(req, res, next) {

  authService.registerSU(req)
  .then(response => res.status(response.status).json(response))
  .catch(next);

}

function validateLogin(req, res, next){
    
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });

    validateRequest(req, res, next, schema);

}

function login(req, res, next) {
    
    authService.login(req.body)
        .then((message) =>  {
            // const allowedOrigins = ['localhost', '192.168.0.105', '192.168.1.12'];

            // Dynamically choose the domain based on the request origin
            // const currentDomain = allowedOrigins.includes(req.hostname) ? req.hostname : 'localhost';
            
            res.cookie("refreshToken", message.refreshToken, { 
                httpOnly: true, 
                secure: true, // Set to `true` in production if you're using HTTPS
                // sameSite: 'None', // This allows cross-origin cookies
                // domain: currentDomain, // Set domain based on the request hostname
                // maxAge: 60 * 60 * 1000 // Example expiry (1 hour)
            });

            if(message.status==200){

                res.status(message.status).json({status:message.status, accessToken: message.accessToken, role: message.role, id: message.id, loggedinTime: message.loggedinTime, contact:message.contact})
                return;
            }

            res.status(message.status).json( message )
        })
        .catch(next);
}


function validateRefreshToken(req, res, next){
    
    const schema = Joi.object({
        // refreshToken: Joi.string().required(),        
        refreshToken: Joi.string().required(),        
    });

    validateRequest(req, res, next, schema);

}

function refreshToken(req, res, next) {
    authService.refreshToken(req)
    .then((message) =>  {

        // const expiryDate = new Date();
        // expiryDate.setMinutes(expiryDate.getMinutes() + 1); // 1 minute from now

        // res.cookie("refreshToken", message.refreshToken, {
        //     httpOnly: true,
        //     secure: true, // Ensures the cookie is only sent over HTTPS
        //     expires: expiryDate, // Set the cookie expiration
        //   });

        res.cookie("refreshToken", message.refreshToken, { httpOnly: true, secure: true })
        if(message.status==200){
            res.status(message.status).json({status:message.status, accessToken: message.accessToken})
            return;
        }

        res.status(message.status).json( message )
    })
    .catch(next);
}

function validateLogout(req, res, next){
    
    const schema = Joi.object({
        refreshToken: Joi.string().required(),        
    });

    validateRequest(req, res, next, schema);

}

function logout(req, res, next) {
    authService.logout(req)
    .then((message) =>{ 
        //res.status(message.status).json(message)
        if(message.status==200){
            res.clearCookie("refreshToken", {
                httpOnly: true, 
                secure: false, // ⬅️ MUST be `false` on localhost, `true` in production
                sameSite: 'none' 
                  });
            res.json(message );
            return;
        }            
        res.status(message.status).json( message )
        // res.clearCookie('token', {
        //     httpOnly: true,
        //     secure: false, // Set to true if using HTTPS
        //     sameSite: 'None', // Required for cross-origin cookies
        //   });
    })
    .catch(next);

}

function resetPassword(req, res, next) {
    
    authService.resetPassword(req.body.email, req.body.newPassword)
        .then(() => res.json({ message: 'Password Reset Successfully!!!' }))
        .catch(next);

}

function validateUpdatePassword(req, res, next){
    
    const schema = Joi.object({
        password: Joi.string().required(),        
    });

    validateRequest(req, res, next, schema);

}

function updatePassword(req, res, next) {
    const username = req.user.username;    
    const password = req.body.password;
    authService.updatePassword({username,password})
        .then(() => res.json({ message: 'Password Updated Successfully!!!' }))
        .catch(next);
}

function validateUser(req, res, next){
    
    const schema = Joi.object({
        username: Joi.string().required()
    });

    validateRequest(req, res, next, schema);

}

function enableUser(req, res, next) {

   
    authService.enableUser(req.body)
    .then((result) => res.status(result.status).json(result)) // Use 'result' instead of 'response'
    .catch(next);
}

function disableUser(req, res, next) {
    authService.disableUser(req.body)
    .then((result) => res.status(result.status).json(result)) // Use 'result' instead of 'response'
    .catch(next);
}


function validateOtp(req, res, next){
    
    const schema = Joi.object({
        otp: Joi.number().required(6)
    });

    validateRequest(req, res,  next, schema);

}

function listUsers(req, res, next) {

    authService.listUsers()
        .then(users => res.json(users))
        .catch(next);

}

