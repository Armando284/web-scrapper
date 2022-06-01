// import packages
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// code constants
const PORT = 8000
const sources = [
    {
        name: 'Play Store',
        url: 'https://play.google.com/store/games?hl=es&gl=US',
        base: 'https://play.google.com',
        selectors: {
            container: '.Si6A0c',
            title: 'span.sT93pb.DdYX5.OnEJge',
            image: 'img.T75of.stzEZd',
            type: 'span.sT93pb.w2kbF',
            stars: 'span.sT93pb.CKzsaf>span.w2kbF',
        }
    }
]

// app configuration
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// scrapping
const getData = async (source) => {
    const articles = []
    await axios(source.url).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        // console.log(html);
        $(source.selectors.container, html).each(function () {
            const title = $(this).find(source.selectors.title).text()
            const image = $(this).find(source.selectors.image).attr('src')
            const type = $(this).find(source.selectors.type).text()
            const stars = $(this).find(source.selectors.stars).text()
            const url = $(this).attr('href')
            articles.push({ title, image, type, stars, url: source.base + url })
        })
        // console.log(articles)
    }).catch(err => console.error(err))
    return { source: source.name, games: articles }
}

// routing
// home
app.get('/', (req, res) => {
    res.send('Welcome to my News API')
    console.log('Welcome to my News API')
})
// news
app.get('/free_games', (req, res) => {
    sources.forEach(source => {
        getData(source).then(articles => {
            res.json(articles)
        }).catch(err => {
            res.status(400).json({ err: err })
            console.error(err)
        })
    })
})
// single source
app.get('/news/:sourceId', async (req, res) => {
    console.log(req.params.sourceId);
})

// server
app.listen(PORT, () => console.log(`App running on PORT ${PORT}`))
