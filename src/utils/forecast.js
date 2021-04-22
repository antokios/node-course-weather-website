require('dotenv').config()
const request = require('postman-request')

const forecast = (latitude, longitude, callback ) => {
    const url = 'http://api.weatherstack.com/current?access_key=' + process.env.WEATHERSTACK_KEY + '&query=' + latitude + ',' + longitude + '&units=m'

    request({ url, json:true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback({
                Code: body.error.code,
                Type: body.error.type
            }, undefined)
        } else {
            const { current: { temperature, feelslike, weather_descriptions, humidity } } = body
            const weatherForecast = `${weather_descriptions[0]}.It is currently ${temperature} degrees out, it feels like ${feelslike}.The humidity is ${humidity}%.`
            callback(undefined, weatherForecast)
        }
    })
}

module.exports = forecast