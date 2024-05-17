var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: { type: '2dsphere', sparse: true}
    }
});

bicicletaSchema.statics.createInstance = function(code, color, modelo, ubicacion){
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
};

bicicletaSchema.methods.toString = function(){
    return 'id: ' + this.id + " | color: " + this.color;
};

bicicletaSchema.statics.allBicis = function(cb){
    this.find({}).exec()
        .then(function (result){
            cb(result)
        })
        .catch(function (err){
            console.log(err);
        });
};

bicicletaSchema.statics.add = function(aBici, cb){
    this.create(aBici)
        .then(function (result){
            cb(result)
        })
        .catch(function (err){
            console.log(err);
        });
};

bicicletaSchema.statics.findByCode = function(aCode, cb){
    this.findOne({code: aCode})
        .then(function (result){
            cb(result)
        })
        .catch(function (err){
            console.log(err);
        });
};

bicicletaSchema.statics.findById = function(anId, cb){
    this.findOne({_id: anId})
        .then(function (result){
            cb(result)
        })
        .catch(function (err){
            console.log(err);
        });
};

bicicletaSchema.statics.removeByCode = function(aCode, cb){
    this.deleteOne({code: aCode})
        .then(function(result){
            cb(result)
        })
        .catch(function(err){
            console.log(err);
        });
};

bicicletaSchema.statics.removeById = function(anId, cb){
    this.deleteOne({_id: anId})
        .then(function(result){
            cb(result)
        })
        .catch(function(err){
            console.log(err);
        });
};

bicicletaSchema.statics.updateByCode = function(bici, cb) {
    this.updateOne({code: bici.code}, {color: bici.color, modelo: bici.modelo, ubicacion: bici.ubicacion})
        .then(function(result){
            cb(result)
        })
        .catch(function(err){
            console.log(err);
        });
};

bicicletaSchema.statics.updateById = function(bici, cb) {
    this.updateOne({_id: bici.id}, {color: bici.color, modelo: bici.modelo, ubicacion: bici.ubicacion})
        .then(function(result){
            cb(result)
        })
        .catch(function(err){
            console.log(err);
        });
};

module.exports = mongoose.model('Bicicleta', bicicletaSchema);


/* var Bicicleta = function (id, color, modelo, ubicacion) {
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
} */


/* Bicicleta.allBicis = [];
Bicicleta.add = function(aBici) {
    Bicicleta.allBicis.push(aBici);
} */

/* Bicicleta.findById = function (aBiciId) {
    var aBici = Bicicleta.allBicis.find(x => x.id == aBiciId);
    if (aBici)
        return aBici;
    else
        throw new Error(`No existe una bicicleta con el id ${aBiciId}`);
}

Bicicleta.removeById = function (aBiciId) {
    for(var i = 0; i < Bicicleta.allBicis.length; i++){
        if (Bicicleta.allBicis[i].id == aBiciId) {
            Bicicleta.allBicis.splice(i, 1);
            break;
        }
    }
}

Bicicleta.updateById = function(aBiciId, aBiciColor, aBiciModelo, aBiciUbiS) {
    if (aBiciId < 1){
        throw new Error(`No existen identificadores menores o iguales a cero ${aBiciId}`);
    } else if (!Bicicleta.allBicis.find(x => x.id == aBiciId)){
        throw new Error(`No existe una bicicleta con el id ${aBiciId}`);
    } else{
        Bicicleta.allBicis[aBiciId-1].color = aBiciColor;
        Bicicleta.allBicis[aBiciId-1].modelo = aBiciModelo;
        Bicicleta.allBicis[aBiciId-1].ubicacion = aBiciUbiS;
    }
} */

/* var a = new Bicicleta(1, 'rojo', 'urbana', [19.432608, -99.133209]);
var b = new Bicicleta(2, 'blanca', 'urbana', [19.432278, -99.133789]);

Bicicleta.add(a);
Bicicleta.add(b); */

/* module.exports = Bicicleta; */