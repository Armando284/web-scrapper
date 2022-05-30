// import packages
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// code constants
const PORT = 8000
const url = 'https://www.theguardian.com/uk'

// app configuration
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// scrapping
const getData = async () => {
    const articles = []
    await axios(url).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        // console.log(html);
        $('.fc-item__title', html).each(function () {
            const title = $(this).text()
            const url = $(this).find('a').attr('href')
            articles.push({ title, url })
        })
        // console.log(articles)
    }).catch(err => console.error(err))
    return articles
}

// routing
app.get('/', (req, res) => {
    getData().then(articles => {
        res.status(200).json(articles)
    }).catch(err => {
        res.status(400).json({ err: err })
        console.error(err)
    })
})

// server
app.listen(PORT, () => console.log(`App running on PORT ${PORT}`))
