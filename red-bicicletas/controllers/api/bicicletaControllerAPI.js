var Bicicleta = require('../../models/bicicleta');


exports.bicicleta_list = function (req, res) {
    Bicicleta.allBicis(function(bicis){
        res.status(200).json({
            bicicletas: bicis
        });
    });
}

exports.bicicleta_create = function(req, res) {
    var bici = Bicicleta.createInstance(req.body.id, req.body.color, req.body.modelo, [req.body.lng, req.body.lat]);
    Bicicleta.add(bici, function(qr){
        res.status(200).json({
            bicicleta: qr
        });
    });
}

exports.bicicleta_update = function(req, res) {
    var bici = Bicicleta.createInstance(req.body.id, req.body.color, req.body.modelo, [req.body.lng, req.body.lat]);
    Bicicleta.updateByCode(bici, function(qr){
        res.status(200).json({
            info: qr
        });
    });    
}

exports.bicicleta_delete = function(req, res) {
    Bicicleta.removeByCode(req.body.id, function(result){
        res.status(204).send();
    });
};
