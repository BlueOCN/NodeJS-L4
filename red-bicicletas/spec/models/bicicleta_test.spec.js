
var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');

describe('Testing Bicicletas', function() {

    beforeAll(function(done) {
        // mongoose.connection.on('connected', console.error.bind(console, ' MongoDB>> connected'));
        // // mongoose.connection.on('connected', () => console.log('connected'));
        // mongoose.connection.on('open', () => console.log(' MongoDB>> open'));
        // mongoose.connection.on('disconnected', () => console.log(' MongoDB>> disconnected'));
        // mongoose.connection.on('reconnected', () => console.log(' MongoDB>> reconnected'));
        // mongoose.connection.on('disconnecting', () => console.log(' MongoDB>> disconnecting'));
        // mongoose.connection.on('close', () => console.log(' MongoDB>> close'));

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
        console.log(' << Bicicletas model test END');
        done();
    });

    beforeEach(function(done){
        console.log(' << Bicicletas model test');
        done();
    });

    afterEach(function(done){
        Bicicleta.deleteMany({})
            .then(function(success){
                // console.log(success);
                done();
            })
            .catch(function(err) {
                // console.log(err);
                done();
            });
    });

    describe('Bicicleta.createInstance', () => {
        it('Crea una instancia de Bicicleta', () => {
    
            var bici = Bicicleta.createInstance(1,"verde", "urbana", [19.432278, -99.133789]);
    
            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toBe(19.432278);
            expect(bici.ubicacion[1]).toBe(-99.133789);
        });
    });

    describe('Bicicleta.allBicis', function(){
        it('comienza vacia', function(done){
            Bicicleta.allBicis(function(bicis){
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe('Bicicleta.findByCode', () => {
        it('debe devovler la bici con code 1', (done) => {
            Bicicleta.allBicis(function(bicis){
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta({code: 1, color: "verde", modelo: "montaña"});
                Bicicleta.add(aBici, function(newBici){
                    // console.log(newBici);
               
                    var aBici2 = new Bicicleta({code: 2, color: "rojo", modelo: "urbano"});
                    Bicicleta.add(aBici2, function(newBici){
                        // console.log(newBici);
                        Bicicleta.findByCode(2, function(targetBici){
                            expect(targetBici.code).toBe(aBici2.code);
                            expect(targetBici.color).toBe(aBici2.color);
                            expect(targetBici.modelo).toBe(aBici2.modelo); 
                            done();
                        });
                    });

                }); 

            });
        });
    });

    describe('Bicicleta.deleteByCode', () => {
        it('Deletes the Bicicle with the given code', (done) => {
            Bicicleta.allBicis(function(bicis){
                // console.log(bicis);
                expect(bicis.length).toBe(0);

                // Create 2 bicicles
                var bici = Bicicleta.createInstance(1,"verde", "urbana", [-99.133789, 19.432278]);
                Bicicleta.add(bici, function(result){
                    // console.log(result);
                    var bici2 = new Bicicleta({code: 2, color: "rojo", modelo: "montaña", ubicacion: [-99.133589, 19.432678]});
                    Bicicleta.add(bici2, function(result){
                        // console.log(result);
                        Bicicleta.removeByCode(bici2.code, function(){
                            Bicicleta.allBicis(function(bicisd){
                                // console.log(bicisd);
                                expect(bicisd.length).toBe(1);
                                expect(bicisd[0].code).toBe(bici.code);
                                done();    
                            });
                            
                        });
                    });
                });
            });
        });
    });

    describe('Bicicleta.updateByCode', () =>{
        it('Updates a bicicle with the given code', (done) => {
            Bicicleta.allBicis(function(bicis){
                // console.log(bicis);
                expect(bicis.length).toBe(0);
                var bici = Bicicleta.createInstance(1,"verde", "urbana", [-99.133789, 19.432278]);
                Bicicleta.add(bici, function(result){
                    // console.log(result);
                    var bici2 = new Bicicleta({code: 2, color: "rojo", modelo: "montaña", ubicacion: [-99.133589, 19.432678]});
                    Bicicleta.add(bici2, function(result){
                        // console.log(result);
                        var newbici = Bicicleta.createInstance(1,"cafe", "circo", [-99.135789, 19.436278]);
                        Bicicleta.updateByCode(newbici, function(result){
                            // console.log(result);
                            Bicicleta.allBicis(function(bicis){
                                // console.log(bicis);
                                expect(bicis.length).toBe(2);
                                done();
                            });
                            
                        });
                    });
                });
            });
        });
    });

});





/* beforeEach(function() {
    Bicicleta.allBicis = [];
});

describe('Bicicleta.allBicis', () => {
    it('comienza vacia', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe('Bicicleta.add', () => {
    it('agregamos una', () => {
        expect(Bicicleta.allBicis.length).toBe(0);

        var bici = new Bicicleta(99, 'blanca', 'urbana', [19.432278, -99.133789]);
        Bicicleta.add(bici);

        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(bici);
    });
});

describe('Bicicleta.findById', () => {
    it('debe devovler la bici con id 1', () => {
        expect(Bicicleta.allBicis.length).toBe(0);

        var a = new Bicicleta(1, 'rojo', 'urbana', [19.432608, -99.133209]);
        var b = new Bicicleta(2, 'blanca', 'urbana', [19.432278, -99.133789]);
        Bicicleta.add(a);
        Bicicleta.add(b);

        var target = Bicicleta.findById(1);
        expect(target.id).toBe(1);
        expect(target.color).toBe(a.color);
        expect(target.modelo).toBe(a.modelo);

    });
});

describe('Bicicleta.removeById', () => {
    it('debe remover la bici con id 1', () => {
        // Lista vacia
        expect(Bicicleta.allBicis.length).toBe(0);

        // Añadir 1 elemento
        var a = new Bicicleta(1, 'rojo', 'urbana', [19.432608, -99.133209]);
        Bicicleta.add(a);
        expect(Bicicleta.allBicis.length).toBe(1);

        // Remover elemnto
        Bicicleta.removeById(a.id)
        expect(Bicicleta.allBicis.length).toBe(0);

    });
});

describe('Bicicleta.updateById', () => {
    it('debe modificar la bici con id 1', () => {
        // Lista vacia
        expect(Bicicleta.allBicis.length).toBe(0);

        // Añadir elemento 1 y 2
        var a = new Bicicleta(1, 'rojo', 'urbana', [19.432608, -99.133209]);
        var b = new Bicicleta(2, 'blanca', 'urbana', [19.432278, -99.133789]);
        Bicicleta.add(a);
        Bicicleta.add(b);
        expect(Bicicleta.allBicis.length).toBe(2);

        // Modificar elemento 1
        var new_color = 'magenta';
        var new_model = 'fukimo';
        var new_location = [19.432108, -99.133809];
        Bicicleta.updateById(a.id, new_color, new_model, new_location);
        expect(Bicicleta.allBicis.length).toBe(2);

        // Corroborar atributos del elemento 1
        expect(a.id).toBe(1);
        expect(a.color).toBe(new_color);
        expect(a.modelo).toBe(new_model);
        expect(a.ubicacion).toBe(new_location);
        
    });
});
 */