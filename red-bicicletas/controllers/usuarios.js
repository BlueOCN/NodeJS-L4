var Usuario = require('../models/usuario');

module.exports = {
    list: function (req, res, next) {
        Usuario.find({})
            .then(function (usuarios) {
                res.render('usuarios/index', {usuarios: usuarios});
            })
            .catch(function (err) {
                console.log(err);
            });
    },
    update_get: function (req, res, next) {
        Usuario.findById(req.params.id)
            .then(function (usuario) {
                res.render('usuarios/update', {errors: {}, usuario: usuario});
            })
            .catch(function (err) {
                console.log(err);
            });
    },
    update: function (req, res, next) {
        var update_values = {nombre: req.body.nombre};
        Usuario.findByIdAndUpdate(req.params.id, update_values)
            .then(function (usuario) {
                res.redirect('/usuarios');
            })
            .catch(function (err) {
                res.render('usuarios/update', {errors: err.errors, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})});
            })
    },
    create_get: function (req, res, next) {
        res.render('usuarios/create', {errors: err.errors, usuario: new Usuario()});
    },
    create: function (req, res, next) {
        if (req.body.password != req.body.confirm_password){
            res.render('usuarios/create', {errors: {confirm_password: {message: 'no coincide con el password ingresado'}}, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})});
            return
        }

        Usuario.create({ nombre: req.body.nombre, email: req.body.email, password: req.body.password})
            .then(function (result) {
                nuevoUsuario.enviar_email_bienvenida();
                res.redirect('/usuarios');
            })
            .catch(function (err) {
                res.render('usuario/create', {errors: err.errors, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})});
            });
    },
    delete: function (req, res, next) {
        Usuario.findByIdAndDelete(req.body.id)
            .then(function () {
                res.redirect('/usuarios');
            })
            .catch(function (err) {
                next(err);
            });
    }
};
