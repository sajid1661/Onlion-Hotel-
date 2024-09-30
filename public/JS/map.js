        //mapToken ko access show.ejs top script tag say milay gi understand.
        console.log(listing.geometry.coordinates);
        mapboxgl.accessToken =mapToken;
        const map = new mapboxgl.Map({
            container: "map", // container ID
            center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
            zoom: 9 // starting zoom
        });

        //Map location per marker added
        const marker = new mapboxgl.Marker({ color: 'red'})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({offset: 25}).setHTML(
            `<h4> ${listing.title}</h4><p> Exact location will be provided after booking</p> `
        ))
        .addTo(map);