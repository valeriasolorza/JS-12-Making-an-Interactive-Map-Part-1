let myMap;
let markers = [];

async function getCoords() {
    pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [pos.coords.latitude, pos.coords.longitude]
}

console.log(getCoords())

async function renderMap() {
    let userLocation = await getCoords()

    myMap = L.map('map').setView(userLocation, 13);
    var marker = L.marker(userLocation).addTo(myMap);
    marker.bindPopup("<b>You are Here</b><br>").openPopup();

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);
}

renderMap()

async function search() {
    let userLocation = await getCoords()
    let businessType = document.getElementById("selection")

    businessType.addEventListener('change', async (event) => {
        markers.forEach(marker => myMap.removeLayer(marker))
        markers = []; //clear markers


        let userChoice = event.target.value;
        try {

            // squarespace API
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'fsq3yMxWHaArjSx19vuNKQxKrEsITJ43Ccsrz9j9QTavvTk='
                }
            }
            let response = await fetch(`https://api.foursquare.com/v3/places/search?query=${userChoice}&ll=${userLocation}&limit=5`, options)
            let data = await response.json()
            console.log(data)


            //location of each location (data)
            let locations = data.results.map(result => ({
                name: result.name, //business name
                lnl: [result.geocodes.main.latitude, result.geocodes.main.longitude] //buisness location
            }))
            console.log(locations)

            //adding markers
            locations.forEach(location => {
                let marker = L.marker(location.lnl)
                .addTo(myMap)
                marker.bindPopup(`<b>${location.name}</b>`).openPopup();

                markers.push(marker) //
            })

        } catch (error) {
            console.log("Fetch Error!", error)
        }
    })
}



search()