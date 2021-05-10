const path = require('path')
const express = require('express')
const hbs = require("hbs");
const { geocode, reverseGeocode } = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

// App routers
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Antonios Kiosses'
    })
})

app.get('/about',(req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Antonios Kiosses'
    })
})

app.get('/help',(req, res) => {
    res.render('help', {
        helpText: 'We are here for everything you need',
        title: 'Help',
        name: 'Antonios Kiosses'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an address"
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, place_name } = { }) => {
        if (error) {
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }

            res.send({
                location: place_name,
                forecast: forecastData
            })
        })
    })
})

app.get('/myWeather', (req, res) => {

    const latitude = req.query.latitude
    const longitude = req.query.longitude

    if(!latitude && !longitude){
        return res.send({
            error: "Something went wrong, refresh the page and try again"
        });
    }

    reverseGeocode(latitude, longitude, (error, { location }) => {
        if(error){
            return res.send(error);
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send(error);
            }
            res.send({
                forecast: forecastData,
                location: location
            });
        });
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: "You must provide a search term"
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 | Page not found',
        errorMsg: "Help article not found",
        name: 'Antonios Kiosses'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 | Page not found',
        errorMsg: "Page not found",
        name: 'Antonios Kiosses'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})