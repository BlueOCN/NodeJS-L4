var Usuario = require('../models/usuario');
var Token = require('../models/token');

module.exports = {
    confirmationGet: function (req, res, next) {
        Token.findOne({token: req.params.token})
            .then(function (token) {
                if (!token) return res.status(400).send({type: 'not-verified', msg: 'El usuario con ese token no existe'});
                Usuario.findById(token._userId)
                    .then(function (usuario) {
                        if (!usuario) return res.status(400).send({msg: 'El usuario con ese token no existe'});
                        if (usuario.verificado) return res.redirect('/usuarios');
                        usuario.verificado = true;
                        usuario.save()
                            .then(function () {
                                return res.redirect('/');
                            })
                            .catch(function (err) {
                                return res.status(500).send({msg: err.message});
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            })
            .catch(function (err) {
                console.log(err); 
            });
    },
}