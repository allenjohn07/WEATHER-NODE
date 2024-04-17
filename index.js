const express = require('express')
const Datastore = require('nedb')
require('dotenv').config()

console.log(process.env);

const app = express()


const Port = process.env.PORT || 3000

app.listen(Port, () => {
    console.log(`Started server at ${Port}`);
})


app.use(express.static('public'))
app.use(express.json())

const database = new Datastore('database.db')
database.loadDatabase()


app.get('/api', (req, res) => {
    database.find({}, (err, data) => {
        if (err) {
            console.error(err);
            res.end()
            return
        }
        res.json(data)
    })
})


app.post('/api', (req, res) => {
    const data = req.body
    // console.log(data);
    const timestamp = Date.now()
    data.timestamp = timestamp
    // const mood = data
    database.insert(data)
    console.log(database);
    res.json(data)
})

app.get('/weather/:latlon', async (req, res) => {
    const latlon = req.params.latlon.split(',')
    const lat = latlon[0]
    const lon = latlon[1]  
    const api_key = process.env.API_KEY  
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
    const weather_response = await fetch(weather_url)
    const weather_data = await weather_response.json()

    const air_url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}`
    const air_response = await fetch(air_url)
    const air_data = await air_response.json()

    const data = {
        weather: weather_data,
        air_quality: air_data
    }

    res.json(data)
})