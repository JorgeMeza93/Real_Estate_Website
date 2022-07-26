(function() {
    
    const lat = 19.4030867;
    const lng = -99.1743499;
    const mapa = L.map('mapa').setView([lat, lng ], 15);
    let marker;
    //Utilizar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    //Colocar el pin 
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)
    //Detectar el movimiento del pin
    marker.on("moveend", function (e){
        marker = e.target;
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));
        //Obtener información de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion, 15).run(function(error, resultado){
            console.log(resultado);
            marker.bindPopup(resultado.address.LongLabel);
            //Llenar los campos
            document.querySelector(".calle").textContent = resultado?.address?.Address ?? "";
            document.querySelector("#calle").value = resultado?.latlng?.lat ?? "";
            document.querySelector("#lng").value = resultado?.latlng?.lng ?? "";

        });
    })
})()