const Debug = require('debug')('app:inicio');
const express = require('express');
const morgan = require('morgan');
const app=express();
const Joi = require('@hapi/joi');
const config = require('config');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//configuración
console.log('Aplicación '+ config.get('nombre'));
console.log('BD server '+ config.get('configDB.host'));


//middleware de tercero: Morgan
if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    Debug('Morgan habilitado...');
}

Debug('Conectando con la bd');

const usuarios=[
    {id:1,nombre:'Carlos'},
    {id:2,nombre:'Carlos1'},
    {id:3,nombre:'Carlos2'},
    {id:4,nombre:'Carlos3'},
    {id:5,nombre:'Carlos4'},
];

app.get('/',(req,res)=>{
    res.send('Saludo desde node.js');
});

app.get('/api/usuarios',(req,res)=>{
    res.send(usuarios);
})

app.get('/api/usuarios/:id',(req,res)=>{
    let usuario=SearchUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('Usuario no encontrado');
        return;
    }
    res.send(usuario);
});

app.post('/api/usuarios',(req,res)=>{
    const {error,value}=ValidarNombre(req.body.nombre);
    if(!error){
       const usuario={
           id:usuarios.length +1,
           nombre:value.nombre
       }
       usuarios.push(usuario);
       res.send(usuario);
    }else{
        const mensaje=error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }
})

app.put('/api/usuarios/:id',(req,res)=>{

    let usuario=SearchUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('Usuario no encontrado');
        return;
    }
    const {error,value}=ValidarNombre(req.body.nombre);
    if(error){
        const mensaje=error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }
    usuario.nombre=value.nombre
    res.send(usuario);
})

app.delete('/api/usuarios/:id',(req,res)=>{
    let usuario=SearchUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('Usuario no encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuarios);
})

//Definir puerto de listener
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`escuchando en ${port}`);
})

//Funciones Generales
function SearchUsuario(ID){
    return (usuarios.find(u=>u.id===parseInt(ID)));
}

function ValidarNombre(Pnombre){
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return(schema.validate({nombre: Pnombre}));
    
}