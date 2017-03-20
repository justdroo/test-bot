'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
// app.get('/', function (req, res) {
// 	res.send('Hello world, NOT chat bot')
// })

// for Facebook verification
app.get('/', function (req, res) {
	if (req.query['hub.verify_token'] === 'EAAD07NbRrUgBAORosBc3oE7XsTdlqkSJwDl8EpAoLuax451WLL4ggDEK14I4mXvgQoVHUv2cr8EPLtI68dINkQIrnsjHHHjIJcGhf9Hhh8T20qCWzuZA8mqG1V0U0QZAIKXTgPMvTF5vzBBRPLxtteGoZAYemm1PUfmRlHJfwZDZD') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
