const goodThermal = JSON.parse(thermal);
mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/dark-v10', // style URL
      center: goodThermal.geometry.coordinates, // starting position [lng, lat]
      zoom: 6 // starting zoom
    });

new mapboxgl.Marker()
    .setLngLat(goodThermal.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${goodThermal.title}</h3><p>${goodThermal.location}</p>`
        )
    )
    .addTo(map)