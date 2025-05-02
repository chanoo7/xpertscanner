const config = require('../config/config.json');
const bcrypt = require('bcrypt');
const db = require('../models/index.js');

const { v1: uuidv1 } = require('uuid');
require('dotenv').config();

const { generateAccessToken, generateRefreshToken, verifyToken, generateDefaultHash, blacklistToken, isBlackListed }  = require('../middleware/authFunctions.js');
const { func, ref } = require('joi');



module.exports = {   
 register,
 login,
 refreshToken,
 logout,
 listUsers,
 resetPassword,
 updatePassword,
 enableUser,
 disableUser,
 updateUser,
 verifyUser
};



async function updateUser(req) {
    try {
        const currentUserId = req.user.id;
        const userUpdates = req.body;

        // Ensure the contactId exists in the request body
        if (!userUpdates.contact || !userUpdates.contact.contactId) {
            return { status: 400, message: "Missing contactId in request body" };
        }

        // Find existing user by contactId
        const existingUser = await db.contacts.findOne({ where: { contactId: userUpdates.contact.contactId } });

        if (!existingUser) {
            return { status: 404, message: "User not found" };
        }

        // If password is included in the request, hash it before saving
        if (userUpdates.password) {
            const hashedPassword = await bcrypt.hash(userUpdates.password, 10);
            userUpdates.password = hashedPassword;
        }

        // Function to parse input into JSON array format
        const parseToJsonArray = (input) => {
            if (!input) return [];  // Return empty array if input is missing

            if (typeof input === "string") {
                try {
                    const parsed = JSON.parse(input);
                    return Array.isArray(parsed) ? parsed : [parsed];  // Ensure it's an array
                } catch (e) {
                    // If not JSON, assume it's a comma-separated key-value list
                    const parts = input.split(",");
                    if (parts.length % 2 !== 0) return [];  // Ensure even number of parts

                    const obj = {};
                    for (let i = 0; i < parts.length; i += 2) {
                        obj[parts[i].trim()] = parts[i + 1].trim();
                    }
                    return [obj]; // Return as an array of objects
                }
            }

            if (Array.isArray(input)) {
                return input.map(item => (typeof item === "string" ? JSON.parse(item) : item));
            }

            return [input];  // Wrap object in an array
        };

        const contactUpdates = {
            legalName: userUpdates.contact.legalName || existingUser.legalName,
            assignedEmployer: userUpdates.contact.assignedEmployer || existingUser.assignedEmployer,
            assignedSites: parseToJsonArray(userUpdates.contact.assignedSites || existingUser.assignedSites),
            designation: userUpdates.contact.designation || existingUser.designation,
            personalInfo: parseToJsonArray(userUpdates.contact.personalInfo || existingUser.personalInfo),
            employmentInfo: parseToJsonArray(userUpdates.contact.employmentInfo || existingUser.employmentInfo),
            bankingInfo: (() => {
                if (typeof userUpdates.contact.bankingInfo === "string") {
                    const [bankName, accountNumber] = userUpdates.contact.bankingInfo.split(",");
                    return [{ bankName: bankName.trim(), accountNumber: accountNumber.trim() }];
                } 
                return parseToJsonArray(userUpdates.contact.bankingInfo || existingUser.bankingInfo);
            })(),
            miscInfo: parseToJsonArray(userUpdates.contact.miscInfo || existingUser.miscInfo),
            updatedBy: currentUserId,
            updatedAt: new Date()
        };

        // Update the contact details
        const updateResult = await db.contacts.update(contactUpdates, { where: { contactId: userUpdates.contact.contactId } });

        // Check if any rows were updated
        if (updateResult[0] === 0) {
            return { status: 400, message: "No changes made or invalid contactId." };
        }

        return { status: 200, message: "User updated successfully" };

    } catch (error) {
        console.error("Error updating user:", error);
        return { status: 500, message: "Unable to update user." };
    }
}



async function register(req) {
    try {
        const currentUserId = req.user.id;
        const user = req.body;
        //console.log(user);
        // Check if username already exists
        const existingUser = await db.users.findOne({ where: { username: user.username } });
        if (existingUser) {
            return { status: 400, message: `Username "${user.username}" is already taken` };
        }

        // Hash password before saving
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }

        user.userId = uuidv1();
        user.createdBy = currentUserId;
        user.updatedBy = currentUserId;

        // Save user to DB
        await db.users.create(user);

        // Create Contact Data
        const contactData = {
            contactId: user.userId,  // Use userId as contactId
            legalName: user.firstName+" "+user.lastName, // Adjust if needed
            assignedEmployer: null, 
            assignedSites: null, 
            designation: null, 
            personalInfo: [{ firstName: user.firstName, lastName: user.lastName }], 
            employmentInfo: null, 
            bankingInfo: null, 
            miscInfo: null, 
            createdBy: currentUserId, 
            updatedBy: currentUserId
        };

        // Save contact to DB
        await db.contacts.create(contactData);

        return { status: 201, message: `Username "${user.username}" was created successfully` };

    } catch (error) {
        console.error("Error creating user:", error);
        return { status: 500, message: "Unable to create user." };
    }
}

async function login(req) {
    try {
        // Find user including account association
        const user = await db.users.findOne({ 
            where: { username: req.username }, 
            include: { model: db.contacts, as: 'contact' } 
        });

        //console.log(user)

        if (!user) {
            return { status: 401, message: "Invalid username or password." };
        }

        // Check failed attempts
        if (user.failedAttempts >= process.env.MAX_FAILED_ATTEMPTS) {
            await db.users.update({ isActive: false }, { where: { username: user.username } });
            return { status: 403, message: "Your account is disabled. Please contact your administrator." };
        }

        // Check if the account is inactive
        if (!user.isActive) {
            return { status: 403, message: "Your account is inactive. Please contact your administrator to activate it." };
        }

        // Prevent multiple logins
        if (user.isLoggedin) {
            return { status: 403, message: "You're already logged in!" };
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(req.password, user.password);
        if (!isPasswordValid) {
            const newFailedAttempts = user.failedAttempts + 1;

            await db.users.update(
                { failedAttempts: newFailedAttempts },
                { where: { username: user.username } }
            );

            return {
                status: 401,
                failedAttempts: newFailedAttempts,
                message: `Username or Password is incorrect. You have ${
                    process.env.MAX_FAILED_ATTEMPTS - newFailedAttempts
                } more attempts to login.`,
            };
        }

        // Reset failed attempts & mark user as logged in
        await db.users.update(
            { isLoggedin: true, failedAttempts: 0 },
            { where: { username: user.username } }
        );

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return { 
            status: 200, 
            accessToken, 
            refreshToken, 
            role: user.role,
            id:user.id,
            loggedinTime: user.updatedAt, 
            contact: user.contact // Including associated account details
        };
    } catch (error) {
        console.error("Login error:", error);
        return { status: 500, message: "An error occurred during login." };
    }
}



async function refreshToken(req) {

    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) return {status:401, message:'Required : Refresh Token'} 

    // const refreshToken = req.refreshToken;
    // const token = await db.blacklistedTokens.findOne({ where:{ token : refreshToken}});

    const blacklistedToken = await isBlackListed(refreshToken);

    if(blacklistedToken) return { status:403, message: 'Refresh token is blacklisted' };

    
    // if(token)
    //     return { message: 'Refresh token is blacklisted' };

    const decodedToken = verifyToken(refreshToken, 'refresh');    

    if(decodedToken){
        const newAccessToken = generateAccessToken(decodedToken);
        const newRefreshToken = generateRefreshToken(decodedToken); 
        // return newAccessToken;
        return { status: 200, accessToken: newAccessToken, refreshToken: newRefreshToken }

    }else
        return { message: 'Invalid or expired refresh token' };         
    
}

async function logout(req, res) {
    //console.log("Calling logout", req.cookies.refreshToken); // Debugging
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token found!" });
    }
    //const refreshToken = req.cookies.refreshToken;    
    const accessToken = req.user.accessToken;

    if(refreshToken){

        await blacklistToken(accessToken,'access');

        const blacklistedToken = await isBlackListed(refreshToken);

        if(blacklistedToken) return { status:403, message: 'Refresh token is blacklisted' };

        const decodedToken = verifyToken(refreshToken, 'refresh');   

        if(decodedToken){

            const id = decodedToken.id;

            await db.users.update({isLoggedin : false}, {where :{id : id}});

            await blacklistToken(refreshToken, 'refresh');

            return {status:200,  message: 'Logged out successfully!' };     

        }else{
            await blacklistToken(refreshToken, 'refresh');

            return {status:403, message: 'Invalid or expired refresh token' };

        }

    }else {
        return { status:403, message: 'Required : Refresh Token' };
    }



    // const accessToken = req.user.accessToken 
    // const refreshToken = req.body.refreshToken;
    // const username = req.user.username

    // const access = await db.blacklistedTokens.findOne({ where:{ token : accessToken}});
    // const refresh = await db.blacklistedTokens.findOne({ where:{ token : refreshToken}});

    // if(access)
    //     return { status:401,  message: 'Access  token is blacklisted' };
    
    // if(refresh)
    //     return { status:401, message: 'Refresh token is blacklisted' };
    
    // const aT = verifyToken(accessToken,'access');
    // const rT = verifyToken(refreshToken,'refresh');

    // if(aT.id != rT.id)
    // {
    //     //Log this error as this is a security issue
    //     // LogSecurityThreat();
    //     await db.users.update({isLoggedin: false, isActive: false}, {where :{username : username}});        
    //     return { status:401, message: 'Unauthorised Access!!!' };
        
    // }  
    
    // const user = await db.users.findOne({ where: { username: username } });

    // if(user.isLoggedin){

    //     blacklistTokens(accessToken, 'access');
    //     blacklistTokens(refreshToken, 'refresh');
        
    //     await db.users.update({isLoggedin : false}, {where :{username : username}});
    //     return {status:200,  message: 'Logged out successfully!' };            

    // }

    // return { status:401, message: 'Unauthorised Access!!!' };

}


async function enableUser(req) {

    const user = await db.users.findOne({ where: { username: req.username } });
// console.log(user)
    if(!user.isActive){

        await db.users.update({isActive : true},{where :{username : req.username}});
        return {status:200,  message: 'User enabled successfully!' };                    

    }

    return {status:400,  message: 'User already enabled!' };     
    
}

async function disableUser(req) {

    const user = await db.users.findOne({ where: { username: req.username } });

    if(user.isActive){

        await db.users.update({isActive : false},{where :{username : req.username}});
        return {status:200,  message: 'User disabled successfully!' };                    

    }

    return {status:400,  message: 'User already disabled!' };            
    
}

// async function resetPassword(username) {

//     newHash = await bcrypt.hash(process.env.DEFAULT_HASH, 10);    
//     await db.users.update({password : newHash},{where :{username : username}});
    
// }

async function resetPassword(username, newpassword) {
    try {
        // Check if user exists
        const user = await db.users.findOne({ where: { username: username } });

        if (!user) {
            return { status: 500, message: "User not found" }; 
        }

        // Hash the new password
        const newHash = await bcrypt.hash(newpassword, 10);

        // Update password
        await db.users.update(
            { password: newHash },
            { where: { username: username } }
        );

        return { status: 200, message: "Password updated successfully" };

    } catch (error) {
        console.error("Error resetting password:", error);
        return { status: 500, message: "Error resetting password" };
    }
}


async function verifyUser(username) {
    try {
        // Check if user exists
        const user = await db.users.findOne({ where: { username: username } });

        if (!user) {
            return { status: 500, message: "User not found" }; 
        }


        return { status: 200, message: "User Found" };

    } catch (error) {
        //console.error("Error Username or email is wrong:", error);
        return { status: 500, message: "Error Username or email is wrong" };
    }
}


async function updatePassword({username, password}) {

    newHash = await bcrypt.hash(password, 10);    
    await db.users.update({password : newHash},{where :{username : username}});
    
}

async function listUsers(req) {
    try {
      // Fetch users along with their associated contact details
      const users = await db.users.findAll({
        include: [
          {
            model: db.contacts, // Use the correct model name 'contacts'
            as: 'contact',      // The alias used in the association
          },
        ],
      });
  
      // Return the users with their contact details
      return {
        status: 200,
        users: users.map((user) => ({
          id: user.id,
          username: user.username,
          isActive: user.isActive,
          isLoggedin: user.isLoggedin,
          lastLoggedInTime: user.updatedAt,
          contact: user.contact , // Adjust field as needed
        })),
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
  