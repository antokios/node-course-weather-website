require('dotenv').config()
const request = require('postman-request')

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.MAPBOX_KEY}&limit=1`

    request({ url, json:true }, (error, { body: { features } }) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (features.length === 0) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            const { center, place_name } = features[0]
            callback(undefined, {
                latitude: center[1],
                longitude:center[0],
                place_name: place_name
            })
        }
    })
}

const reverseGeocode = (latitude, longitude, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(longitude)},${encodeURIComponent(latitude)}.json?access_token=${process.env.MAPBOX_KEY}&limit=1`

    request({ url, json: true }, (error, { body: { features } }) => {
        if(error){
            callback('Unable to connect to location services!', undefined);
        } else if(features.length === 0){
            callback({error: 'Unable to find location. Try another search.'}, undefined);
        } else {
            const { place_name } = features[0]
            callback(undefined, {
                location: place_name
            });
        }
    })

}

module.exports = {
    geocode,
    reverseGeocode
}