var mongoose = require('mongoose');
var Usuario = require('../../models/usuario');
var Bicicleta = require('../../models/bicicleta');
var Reserva = require('../../models/reserva');
var request = require('request');
var server = require('../../bin/www');

var base_url = "http://localhost:3000/api/usuarios";


describe('Usuarios API', () => {

    beforeAll(function(done){
        // mongoose.connection.once('open', function(){
        //     console.log('We are connected to test database!');
        //     done();
        // });
        var mongoDB = 'mongodb://localhost:27017/testdb';
        mongoose.connect(mongoDB, { useNewUrlParser: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error: '));

        db.once('open', function(){
            console.log('We are connected to test database!');
            done();
        });
    });

    afterAll(function(done){
        mongoose.disconnect();
        console.log('We are not longer connected to test database!');
        console.log(' << Usuarios API test END');
        done();
    });
    
    beforeEach(function(done){
        console.log(' << Usuarios API test');
        done();
    });

    afterEach(function(done){
        Usuario.deleteMany({})
            .then(function(success){
                console.log('Dropped Usuario:\t', success);
                Bicicleta.deleteMany({})
                    .then(function(success){
                        console.log('Dropped Bicicleta:\t', success);
                        Reserva.deleteMany({})
                            .then(function(success){
                                console.log('Dropped Reserva:\t', success);                                
                                done();
                            })
                            .catch(function(err) {
                                console.log('Reserva doc', err);
                                done();
                            });
                    })
                    .catch(function(err) {
                        console.log('Bicicleta doc', err);
                        done();
                    });
            })
            .catch(function(err) {
                console.log('Usuario doc', err);
                done();
            });
    });

    describe('GET USUARIOS /', () => {
        it('status 200', (done) => {
            request.get(base_url, function (error, response, body){
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.usuarios.length).toBe(0);
                done();
            });
        });
    });

    describe('POST USUARIOS /create', () => {
        it('status 200', (done) => {
            Usuario.find({})
                .then(function(result){
                    expect(result.length).toBe(0);
                })
                .catch(function(err){
                    console.log(err);
                });

            var headers = {'content-type' : 'application/json'};
            var usuario = '{ "nombre": "Juanito" }';


            request.post({
                headers: headers,
                url: base_url + '/create',
                body: usuario
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                var usuario = JSON.parse(body).usuarios;
                expect(usuario.nombre).toBe("Juanito");
                done();
            });
            
        });
    });

    describe('POST USUARIOS /reservar', () => {
        it('status 200', (done) => {

            var usuario = new Usuario({nombre: 'LilZsa'});
            usuario.save()
                .then(function(result){
                    // console.log(result);
                })
                .catch(function(err){
                    console.log(err);
                });

            var bici = Bicicleta.createInstance(10,"verde", "urbana", [-99.133789, 19.432278]);
            Bicicleta.add(bici, function(result){
                // console.log(result);
            });

            var headers = {'content-type' : 'application/json'};
            var user = '{ "id": "'+usuario._id+'",  "bici_id" : "'+bici._id+'", "desde" : "2024-05-15T23:54:19.407Z", "hasta" : "2024-05-16T23:54:19.407Z" }';


            request.post({
                headers: headers,
                url: base_url + '/reservar',
                body: user
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

});