// import packages
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

// code constants
const PORT = 8000

const app = express(PORT, () => console.log(`App running on PORT ${PORT}`))
