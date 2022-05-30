// import packages
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

// code constants
const PORT = 8000
const url = 'https://www.theguardian.com/uk'

const app = express()

axios(url).then(response => {
    const html = response.data
    const $ = cheerio.load(html)
    const articles = []
    // console.log(html);
    $('.fc-item__title', html).each(function () {
        const title = $(this).text()
        const url = $(this).find('a').attr('href')
        articles.push({ title, url })
    })
    console.log(articles)
}).catch(err => console.error(err))

app.listen(PORT, () => console.log(`App running on PORT ${PORT}`))
