const fs = require('fs');

const myInterceptor = (req, res, next) => {
    // Perform actions before handling the request
    console.log('Interceptor activated');

    // Modify request object or perform any required action
    // For example, adding a timestamp to the request
    req.requestTime = new Date();

    // Extract information from the request
    const requestInfo = {
        method: req.method,
        url: req.originalUrl,
        timestamp: req.requestTime.toString(),
        // Add any other information you want to log
    };

    // Convert the request information to a string
    const requestLog = JSON.stringify(requestInfo, null, 2);

    // Write the request information to a text file
    fs.appendFile('requestLogs.txt', requestLog + '\n', (err) => {
        if (err) {
            console.error('Error writing request information to file:', err);
        }
    });

    // Pass control to the next middleware
    next();
};

module.exports = myInterceptor;
