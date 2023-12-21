// Interceptor middleware function
const myInterceptor = (req, res, next) => {
    // Perform actions before handling the request
    console.log('Interceptor activated');
    
    // Modify request object or perform any required action
    // For example, adding a timestamp to the request
    req.requestTime = new Date();
  
    // Pass control to the next middleware
    next();
  };


module.exports = myInterceptor