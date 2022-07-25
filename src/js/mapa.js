(function() {
    
    const lat = 19.4030867;
    const lng = -99.1743499;
    const mapa = L.map('mapa').setView([lat, lng ], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


})()