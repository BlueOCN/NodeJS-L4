const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');

passport.use(new LocalStrategy(
    function (email, password, done) {
        Usuario.findOne({email: email}).exec()
            .then(function (usuario, err) {
                console.log(usuario,err);
                if (err) return done(err);
                if (!usuario) return done(null, false, {message: 'Email no existente o incorrecto.'});
                if (!usuario.validPassword(password)) return done(null, false, {message: 'Contraseña incorrecta'});
                return done(null, usuario);
            });
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    Usuario.findById(id)
        .then(function (usuario, err) {
            cb(err, usuario);
        });
});

module.exports = passport;