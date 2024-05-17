var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

var base_url = "http://localhost:3000/api/bicicletas";


describe('Bicicletas API', () => {

    beforeAll(function(done){
        mongoose.connection.once('open', function(){
            console.log('We are connected to test database!');
            done();
        });
    });

    afterAll(function(done){
        mongoose.disconnect();
        console.log('We are not longer connected to test database!');
        console.log(' << Bicicletas API test END');
        done();
    });
    
    beforeEach(function(done){
        console.log(' << Bicicletas API test');
        done();
    });

    afterEach(function(done){
        Bicicleta.deleteMany({})
            .then(function(success){
                console.log('Dropped Usuario:\t', success);
                done();
            })
            .catch(function(err) {
                console.log('Bicicleta doc', err);
                done();
            });
    });


    describe('GET BICICLETAS /', () => {
        it('status 200', (done) => {
            request.get(base_url, function (error, response, body){
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(0);
                done();
            });
        });
    });

    describe('POST BICICLETAS /create', () => {
        it('status 200', (done) => {
            Bicicleta.allBicis(function(bicis){
                expect(bicis.length).toBe(0);
            });
            var headers = {'content-type' : 'application/json'};
            var bici = '{ "id": 10, "color": "caca", "modelo": "asteroide", "lat": 19.431278, "lng": -99.135789 }';

            request.post({
                headers: headers,
                url: base_url + '/create',
                body: bici
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body).bicicleta;

                expect(bici.color).toBe("caca");
                expect(bici.modelo).toBe("asteroide");
                expect(bici.ubicacion[1]).toBe(19.431278);
                expect(bici.ubicacion[0]).toBe(-99.135789);
                done();
            });
        });
    });

    describe('POST BICICLETAS /update', ()=> {
        it('status 200', (done) => {
            Bicicleta.allBicis(function(bicis){
                expect(bicis.length).toBe(0);
                var targetBici = Bicicleta.createInstance(10,"verde", "urbana", [-99.133789, 19.432278]);
                Bicicleta.add(targetBici, function(result){
                    // console.log(result);
                });
            });
            var headers = {'content-type' : 'application/json'};
            var bici = '{ "id": 10, "color": "caca", "modelo": "asteroide", "lat": 19.431278, "lng": -99.135789 }';

            request.post({
                headers: headers,
                url: base_url + '/update',
                body: bici
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                var info = JSON.parse(body).info;
                // console.log(body);
                expect(info.acknowledged).toBe(true);
                expect(info.modifiedCount).toBe(1);
                expect(info.matchedCount).toBe(1);
                Bicicleta.allBicis(function(bicis){
                    // console.log(bicis);
                    expect(bicis.length).toBe(1);
                    expect(bicis[0].color).toBe("caca");
                    expect(bicis[0].modelo).toBe("asteroide");
                    expect(bicis[0].ubicacion[1]).toBe(19.431278);
                    expect(bicis[0].ubicacion[0]).toBe(-99.135789);
                    done();
                });
            });

        });
    });

    describe('POST BICICLETAS /delete', () =>{
        it('status 200', (done) => {
            Bicicleta.allBicis(function(bicis){
                expect(bicis.length).toBe(0);
                var targetBici = Bicicleta.createInstance(10, "verde", "urbana", [-99.133789, 19.432278]);
                Bicicleta.add(targetBici, function(result){
                    // console.log(result);
                    Bicicleta.allBicis(function(bicis){
                        // console.log(bicis);
                        expect(bicis.length).toBe(1);

                        var headers = {'content-type' : 'application/json'};
                        var bici = '{ "id": 10 }';

                        request.post({
                            headers: headers,
                            url: base_url + '/delete',
                            body: bici
                        }, function(error, response, body) {
                            expect(response.statusCode).toBe(204);
                            Bicicleta.allBicis(function(bicis){
                                // console.log(bicis);
                                expect(bicis.length).toBe(0);
                                done();
                            });
                            
                        });

                    });
                });
            });

        });
    });

});















// beforeEach(function() {
//     Bicicleta.allBicis = [];
// });

// describe('Bicicletas API', () => {
//     // describe('GET BICICLETAS /', () => {
//     //     it('status 200', () => {
//     //         expect(Bicicleta.allBicis.length).toBe(0);

//     //         var bici = new Bicicleta(5, 'blanca', 'urbana', [19.432278, -99.133789]);
//     //         Bicicleta.add(bici);

//     //         expect(Bicicleta.allBicis.length).toBe(1);

//     //         request.get('http://localhost:3000/api/bicicletas', function (error, response, body){
//     //             expect(response.statusCode).toBe(200);
//     //         });
//     //     });
//     // });

//     // describe('GET BICICLETAS /', () => {
//     //     it('status 200', () => {
//     //         expect(Bicicleta.allBicis.length).toBe(0);
    
//     //         var a = new Bicicleta(5, 'blanca', 'urbana', [19.432278, -99.133789]);
//     //         Bicicleta.add(a);
    
//     //         expect(Bicicleta.allBicis.length).toBe(1);
    
//     //         request.get('http://localhost:3000/api/bicicletas', function (error, response, body){
//     //             expect(response.statusCode).toBe(200);
//     //         });
//     //     });
//     // });

//     // describe('POST BICICLETAS /create', () => {
//     //     it('status 200', (done) => {
//     //         expect(Bicicleta.allBicis.length).toBe(0);
//     //         var headers = {'content-type' : 'application/json'};
//     //         var bici = '{ "id": 10, "color": "caca", "modelo": "asteroide", "lat": 19.431278, "lng": -99.135789 }';

//     //         request.post({
//     //             headers: headers,
//     //             url: 'http://localhost:3000/api/bicicletas/create',
//     //             body: bici
//     //         }, function(error, response, body) {
//     //             expect(response.statusCode).toBe(200);
//     //             expect(Bicicleta.findById(10).color).toBe("caca");
//     //             expect(Bicicleta.findById(10).modelo).toBe("asteroide");
//     //             expect(Bicicleta.findById(10).ubicacion[0]).toBe(19.431278);
//     //             expect(Bicicleta.findById(10).ubicacion[1]).toBe(-99.135789);
//     //             expect(Bicicleta.allBicis.length).toBe(1);
//     //             done();
//     //         });
//     //     });
//     // });
// });