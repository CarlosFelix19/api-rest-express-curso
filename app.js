const Debug = require('debug')('app:inicio');
const express = require('express');
const morgan = require('morgan');
const app=express();
const config = require('config');
const usuarios = require('./routes/usuarios');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/usuarios',usuarios);

//configuración
console.log('Aplicación '+ config.get('nombre'));
console.log('BD server '+ config.get('configDB.host'));

//middleware de tercero: Morgan
if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    Debug('Morgan habilitado...');
}

Debug('Conectando con la bd');

app.get('/',(req,res)=>{
    res.send('Saludo desde node.js');
});

//Definir puerto de listener
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`escuchando en ${port}`);
})
