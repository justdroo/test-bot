// Index route
app.get('/', function (req, res) {
	res.send('Hello world, this is a test chat bot')
})

// Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === token) {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})
