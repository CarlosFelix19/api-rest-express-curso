const express = require('express');
const rutas = express.Router();
const Joi = require('@hapi/joi');

const usuarios=[
    {id:1,nombre:'Carlos'},
    {id:2,nombre:'Carlos1'},
    {id:3,nombre:'Carlos2'},
    {id:4,nombre:'Carlos3'},
    {id:5,nombre:'Carlos4'},
];

rutas.get('/',(req,res)=>{
    res.send(usuarios);
})

rutas.get('/:id',(req,res)=>{
    let usuario=SearchUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('Usuario no encontrado');
        return;
    }
    res.send(usuario);
})

rutas.post('/',(req,res)=>{
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

rutas.put('/:id',(req,res)=>{

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

rutas.delete('/:id',(req,res)=>{
    let usuario=SearchUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('Usuario no encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuarios);
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

module.exports=rutas;