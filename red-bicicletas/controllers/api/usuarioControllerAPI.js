var Usuario = require('../../models/usuario');


exports.usuarios_list = function(req, res) {
    Usuario.find({})
        .then(function(result){
            res.status(200).json({
                usuarios: result
            });
        })
        .catch(function(err){
            console.log(err);
            res.status(404).send();
        });
};

exports.usuarios_create = function(req, res) {
    var usuario = new Usuario({nombre: req.body.nombre});
    usuario.save()
        .then(function(){
            res.status(200).json({
                usuarios: usuario
            });
        })
        .catch(function(err){
            console.log(err)
        });
};

exports.usuario_reservar = function(req, res) {
    Usuario.findById(req.body.id).exec()
        .then(function(usuario){
            usuario.reservar(req.body.bici_id, req.body.desde, req.body.hasta, function(){
                res.status(200).send();
            });
        })
        .catch(function(err){
            console.log(err);
        });
};



// exports.usuarios_list = function(req, res) {
//     Usuario.find({}, function(err, usuarios){
//         res.status(200).json({
//             usuarios: usuarios
//         });
//     });
// };

// exports.usuarios_create = function(req, res) {
//     var usuario = new Usuario({nombre: req.body.nombre});

//     usuario.save(function(err){
//         res.status(200).json(usuario);
//     });
// };

// exports.usuario_reservar = function(req, res) {
//     Usuario.findById(req.body.id, function(err, usuario){
//         usuario.reservar(req.body.bici_id, req.body.desde, req.body.hasta, function(err){
//             res.status(200).send();
//         });
//     });
// };