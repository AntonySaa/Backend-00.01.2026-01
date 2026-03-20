console.log("Inicio de la applicacion");

const express = require('express');
require("dotenv").config();

const syncDB = require('./sync-db');
const {sequelize} = require('./models');
const {userRouter} = require('./routes/user.route');
const {postRouter} = require('./routes/post.route');
const {commentRouter} = require('./routes/comment.route')


const app = express();

app.use(express.json());

app.use((req,res,next)=>{
    res.header(
        "Access-Control-Allow-Origin",
        "Origin, Content-Type, Accept"
    );
    next();
})

app.use('/user',userRouter);
app.use('/post',postRouter);
app.use('/comment',commentRouter);

app.get('/health',(req,res)=>{
    res.json({status:true})
})

app.listen(process.env.PORT || 3000 , async ()=>{
    try {
        await syncDB();
        console.log("Base de datos sincronizada")
    } catch (error) {
        console.error(error)
    }
    console.log(`Server Ready in port ${process.env.PORT}` )
})