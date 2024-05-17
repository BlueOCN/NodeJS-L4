var Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = function (req, res) {
    Bicicleta.allBicis(function (bicis) {
        res.render('bicicletas/index', {bicis: bicis}); 
    });
}

exports.bicicleta_create_get = function(req, res) {
    res.render('bicicletas/create');
}

exports.bicicleta_create_post = function(req, res) {
    var bici = new Bicicleta({code: req.body.id, color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lng, req.body.lat]});
    Bicicleta.add(bici, function () {
        res.redirect('/bicicletas');
    });
}

exports.bicicleta_delete_post = function(req, res) {
    Bicicleta.removeById(req.body.id, function (result) {
        res.redirect('/bicicletas');
    });
}

exports.bicicleta_update_get = function(req, res) {
    var bici = Bicicleta.findById(req.params.id, function (bici) {
        res.render('bicicletas/update', {bici});
    });    
}

exports.bicicleta_update_post = function(req, res) {
    Bicicleta.findById(req.params.id, function (bici) {
        console.log(bici._id);
        bici._id = req.body.id;
        bici.color = req.body.color;
        bici.modelo = req.body.modelo;
        bici.ubicacion = [req.body.lat, req.body.lng];
        Bicicleta.updateById(bici, function (result) {
            res.redirect('/bicicletas');
        })
    });
}