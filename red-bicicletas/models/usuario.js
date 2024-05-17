var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Reserva = require('./reserva');
var bcrypt = require('bcrypt');
var saltRounds = 10;

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
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
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


module.exports = mongoose.model('Usuario', usuarioSchema);