var map = L.map('main_map').setView([19.432608, -99.133209], 18);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

$.ajax({
    dataType: "json",
    url: "api/bicicletas",
    success: function(result){
        result.bicicletas.forEach(function(bici){
            L.marker(bici.ubicacion.reverse(), {title: bici.code}).addTo(map);
        });
    }
})