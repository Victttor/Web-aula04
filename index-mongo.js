const express = require ('express');
const mongoose = require ('mongoose');
const Frase = require('./frase.model');

const app = express();
app.use(express.json());

const db_host='localhost';
const db_port=27017;
const db_db='frases';
const mongoURI=`mongodb:\/\/${db_host}:${db_port}/${db_db}`; //mongodb://localhost:27017/frases

mongoose.connect(mongoURI, {useNewUrlParser:true});


app .get('/', (req, res)=>{
    res.send("Prog. Web - Hello World.");
})

app .get('/frases', (req, res)=>{
    Frase.find({})
        .then((frases)=>{
            res.send(frases);
        })
        .catch((err)=>{
            res.status(500).send();
        })
})

/*app .post('/frases', (req, res)=>{
    let frase={
        autor: req.body.autor,
        frase: req.body.frase
    }
    Frase.create(frase)
        .then((f)=>{
            res.status(201).send(f);
        })
        .catch((err)=>{
            console.error(err);
            res.status(500).send();
        })
   
})*/

app.post('/frases', async (req, res) => {
    const frasesRecebidas = req.body;
  
    if (!frasesRecebidas || !Array.isArray(frasesRecebidas) || frasesRecebidas.length === 0) {
        res.status(404).send();
    }
  
    const frasesSalvas = [];
  
    // Utiliza um loop for para iterar sobre as frases
    for (const { autor, frase } of frasesRecebidas) {
      try {
        // Cria um novo objeto Frase
        const novaFrase = new Frase({
          autor,
          frase
        });
  
        // Salva a nova frase no banco de dados e adiciona à lista de frases salvas
        const fraseSalva = await novaFrase.save();
        frasesSalvas.push(fraseSalva);
      } catch (err) {
        console.error(err);
            res.status(404).send();
      }
    }
  
    res.status(201).json(frasesSalvas);
  });
  

app.delete('/frases/:id',(req,res)=>{
    let id=req.params.id;
    Frase.findByIdAndDelete(id)
        .then(()=>res.status(200).send())
        .catch(()=>res.status(404).send())

})

app.put ('/frases/:id', (req,res)=>{
    let id=req.params.id;
    let f= req.body;
    Frase.findById(id)
        .then((frase)=>{
            frase.autor=f.autor;
            frase.frase=f.frase;
            frase.save()
                .then(()=>res.status(200).send())
                .catch(()=>res.status(500).send())
        })
        .catch(err=>{
            console.log(err);
            res.status(404).send();
        })
})

app .get('/produtos', (req, res)=>{
    res.send("Prog. Web - produtos.");
})

const port = 8088;
app.listen(port, (err)=>{
    if (err){
        console.error("Erro na aplicação",err);
    }
    console.log(`Aplicacao escturando na porta: ${port}`);
})