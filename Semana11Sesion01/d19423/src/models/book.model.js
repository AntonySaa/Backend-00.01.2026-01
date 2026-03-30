const { Schema, model, Types } = require('mongoose');

const bookSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    year:{
        type: Number,
        min: [1450, 'Año muy antiguo'],
        max: [ new Date().getFullYear(), "Año en el futuro no es permitido"]
    },
    author:{
        type: Types.ObjectId,
        ref: 'Author',
        required: true
    },
    tags:[
        { 
            type: String,
            lowercase: true,
            trim: true
        }
    ],
    price:{
        type: Number,
        required: true,
        min: 0,
        set: v=>Math.round(v*100)/100
    },
    inStock:{
        type: Boolean,
        default:  true
    },
    deleteAt:{
        type: Date,
        default: null
    }
}, {timestamps: true});

bookSchema.index({title: 'text'});
bookSchema.virtual('isClassic').get(()=>{
    return this.year && this.year < 1980
});

module.exports =  model('Book', bookSchema);