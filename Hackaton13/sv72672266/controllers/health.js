const os = require('os');

exports.getHealthApi = (req, res) => {
    res.status(200).json({
        status: 'ok',
        platform: os.platform(),
        type: os.type(),
        release: os.release(),
        arch: os.arch(),
        hostname: os.hostname(),
        totalMemGB: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2),
        freeMemGB: (os.freemem() / (1024 * 1024 * 1024)).toFixed(2),
    })
}
