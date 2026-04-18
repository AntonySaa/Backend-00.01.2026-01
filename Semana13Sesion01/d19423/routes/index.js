var router =  require('express').Router();
const healthController = require('../controllers/health')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'x-codec' });
});

router.get('/health',healthController.getHealthApi);
router.post('/health',(req,res)=>{
  res.send({message:"Todo bien desde el post"})
})

router.route('/profile')
  .get((req,res)=>res.json({message: "get Profile"}))
  .post((req,res)=>res.json({message: "post Profile"}))
  .put((req,res)=>res.json({message: "put Profile"}))
  .patch((req,res)=>res.json({message: "patch Profile"}))
  .delete((req,res)=>res.json({message: "delete Profile"}))
  // .head((req,res)=>res.json({message: "head Profile"}))
  // .options((req,res)=>res.json({message: "options Profile"}))

module.exports = router;
