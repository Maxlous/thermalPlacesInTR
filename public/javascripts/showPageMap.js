mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/dark-v10', // style URL
      center: thermal.geometry.coordinates, // starting position [lng, lat]
      zoom: 6 // starting zoom
    });

map.addControl(new mapboxgl.NavigationControl(), "bottom-right");


new mapboxgl.Marker()
    .setLngLat(thermal.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${thermal.title}</h3><p>${thermal.location}</p>`
        )
    )
    .addTo(map)