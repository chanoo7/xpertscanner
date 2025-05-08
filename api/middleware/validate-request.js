module.exports = validateRequest;

function validateRequest(req, res,  next, schema) {
  
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: false // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        // next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        // next({status:401 }, 'Validation Error')
        const messages = error.details.map(x => x.message).join(', ');
        return res.status(401).json({
            status: 401,
            message: 'Validation error',
            details: messages
        });
    } else {   
        req.body = value;
        next();
    }
}