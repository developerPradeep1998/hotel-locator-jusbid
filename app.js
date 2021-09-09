const myMap = L.map('map').setView([22.9074872, 79.07306671], 5);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Coded by coder\'s gyan with ❤️';
const tileLayer = L.tileLayer(tileUrl, { attribution });
tileLayer.addTo(myMap);


const appAction = async () => {
    let hotelsList = [];
    const response = await fetch('http://rudrohom.com:1337/get-hotels');
    const hotels = await response.json(); //extract JSON from the http response
    // do something with myJson
    console.log("Hotels list:", hotels.data);
    hotelsList = hotels.data;

    function generateList() {
        console.log("hotelsList", hotelsList)
        const ul = document.querySelector('.list');
        hotelsList.forEach((hotel) => {
            const li = document.createElement('li');
            const div = document.createElement('div');
            const a = document.createElement('a');
            const p = document.createElement('p');
            a.addEventListener('click', () => {
                flyToStore(hotel);
            });
            div.classList.add('shop-item');
            a.innerText = hotel.name;
            a.href = '#';
            p.innerText = hotel.address;

            div.appendChild(a);
            div.appendChild(p);
            li.appendChild(div);
            ul.appendChild(li);
        });
    }

    generateList();

    function makePopupContent(hotel) {
        return `
        <div>
            <h4>${hotel.name}</h4>
            <p>${hotel.address}</p>
            <div class="phone-number">
                <a href="tel:${hotel.mobile}">${hotel.mobile}</a>
            </div>
        </div>
      `;
    }
    function onEachFeature(feature, layer) {
        layer.bindPopup(makePopupContent(feature), { closeButton: false, offset: L.point(0, -8) });
    }

    var myIcon = L.icon({
        iconUrl: 'marker.png',
        iconSize: [30, 40]
    });

    const shopsLayer = L.geoJSON(hotelsList, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, { icon: myIcon });
        }
    });
    shopsLayer.addTo(myMap);

    function flyToStore(hotel) {
        const lat = hotel.latitude;
        const lng = hotel.longitude;
        myMap.flyTo([lat, lng], 14, {
            duration: 3
        });
        setTimeout(() => {
            L.popup({ closeButton: false, offset: L.point(0, -8) })
                .setLatLng([lat, lng])
                .setContent(makePopupContent(hotel))
                .openOn(myMap);
        }, 3000);
    }


}
appAction()
