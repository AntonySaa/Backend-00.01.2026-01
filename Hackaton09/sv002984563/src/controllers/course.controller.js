const db = require(`../models`);
const Course = db.Course;

exports.addCourse = async(req,res)=>{
    let course = req.body;
    course.UserId = req.params.studentId;
    course.slug = convertToSlug(course.title);
    course.create(course).then(data =>{
        res.status(201).send(data)
    }).catch(error=>{
        res.status(500).send({message:error});
    })
}


function convertToSlug(title){
    return title.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}