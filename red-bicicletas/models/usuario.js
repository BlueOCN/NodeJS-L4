var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Reserva = require('./reserva');
var bcrypt = require('bcrypt');
const crypto = require('crypto');
var saltRounds = 10;

const Token = require('../models/token');
const mailer = require('../mailer/mailer');

// var usuarioSchema = new Schema({
//     nombre: String
// });

// usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
//     var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
//     console.log(reserva);
//     reserva.save(cb);
// }

var Schema = mongoose.Schema;

const validateEmail = function(email) {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
}

var usuarioSchema = new Schema({
        nombre: {
            type: String,
            trim: true,
            required: [true, 'El nombre es obligatorio']
        },
        email: {
            type: String,
            trim: true,
            required: [true, 'El email es obligatorio'],
            lowercase: true,
            unique: true,
            validate: [validateEmail, 'Ingrese un email valido'],
            match: [/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i]
        },
        password: {
            type: String,
            required: [true, 'El password es obligatorio']
        },
        passwordResetToken: String,
        passwordResetTokenExpires: Date,
        verificado: {
            type: Boolean,
            default: false
        }
    });

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe con otro usuario.'});

usuarioSchema.pre('save', function(next){
    if (this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};


usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
    reserva.save()
        .then(function(result){
            cb()
        })
        .catch(function (err) {
            console.log(err);
        });
}

usuarioSchema.methods.enviar_email_bienvenida = function (cb) {
    const token = new Token({_userId: this._id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save()
        .then(function () {
            const mailOptions = {
                from: '"RB" <redBicicletas@team.com>',
                to: email_destination,
                subject: "Verificación de cuenta ✔",
                text: "Hola,\n\n" + 'Por favor, para verificar su cuenta haga click en el siguiente enlace:\n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '.\n'
            };

            mailer.sendMail(mailOptions, function (err) {
                if (err) { return console.log(err.message); }
                console.log('A verification email has been send to ' + email_destination + '.');
            });
        })
        .catch(function (err) {
            console.log(err.message);
        });

}


module.exports = mongoose.model('Usuario', usuarioSchema);