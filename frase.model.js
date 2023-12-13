const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var FraseSchema=new Schema(
    {
        autor: String,
        frase: String

    },
    { versionKey: false, collection:'frases'}
);

module.exports=mongoose.model("Frase",FraseSchema);