const controller = require('../controllers/auth.controller');
const {verifySignUp} = require('../middelwares');

module.exports = (app)=>{
    app.use((req,res,next)=>{
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/auth/signup",[
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRoleExisted
    ], controller.signup);

    app.post("/api/auth/signout",controller.signuot);

    app.post('/api/auth/signin',controller.signin);
}