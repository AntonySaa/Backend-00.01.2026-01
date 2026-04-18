const os  = require('os');
exports.getHealthApi = (req,res)=>{
    res.status(200).json({
        // Basic system information
        'OS Platform': os.platform(),
        'OS Type': os.type(),
        'OS Release': os.release(),
        'CPU Architecture': os.arch(),
        'Hostname': os.hostname(),
        
        // Memory information
         'totalMemGB' : (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2),
         'freeMemGB' : (os.freemem() / (1024 * 1024 * 1024)).toFixed(2),
        
    })
}