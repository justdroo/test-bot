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
app.get('/', function (req, res) {
	res.send('Hello world, this is a test chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'EAAD07NbRrUgBAORosBc3oE7XsTdlqkSJwDl8EpAoLuax451WLL4ggDEK14I4mXvgQoVHUv2cr8EPLtI68dINkQIrnsjHHHjIJcGhf9Hhh8T20qCWzuZA8mqG1V0U0QZAIKXTgPMvTF5vzBBRPLxtteGoZAYemm1PUfmRlHJfwZDZD') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

//Request for setting Greeting message
function createGreetingApi(data) {
  request({
      uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
      qs: { access_token:token },
      method: 'POST',
      json: data
}, function (error, response, body) {
if (!error && response.statusCode == 200) {
  console.log("Greeting set successfully!");
} else {
  console.error("Failed calling Thread Reference API", response.statusCode, response.statusMessage, body.error);
}
});
}
//Setting what the greeting text will be
function setGreetingText() {
  var greetingData = {
    setting_type: "greeting",
    greeting:{
      "text":"Welcome to the test bot *da test bot*",
      "attachment":{
      "type":"image",
      "payload":{
        "url":"http://iruntheinternet.com/lulzdump/images/welcome-to-the-internet-guide-horse-mask-cat-boat-13546737940.png?id="
      }
    }
  }
};
createGreetingApi(greetingData);
}

function sendGenericMessage(sender) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": "You da best",
				    "subtitle": "like ur so cool",
				    "buttons": [{
					    "type": "postback",
					    "title": "I kno dat",
					    "payload": "Bish y u so extra all the time?"
				    }, {
					    "type": "postback",
					    "title": "Thanks!",
					    "payload": "Ur welcome boo boo",
				    }],
			    }, {
				    "title": "Second card",
				    "subtitle": "Element #2 of an hscroll",
				    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
				    "buttons": [{
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for second element in a generic bubble",
				    }],
			    }]
		    }
	    }
    }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

function sendColors(sender) {
  let messageData = {
          "text":"Pick a color:",
          "quick_replies":[
            {
              "content_type":"text",
              "title":"Red",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            },
            {
              "content_type":"text",
              "title":"Green",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            }
          ]
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

app.post('/webhook/', function (req, res) {
  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i]
    let sender = event.sender.id
    if (event.message && event.message.text) {
      let text = event.message.text
      if (text === 'Generic') {
        sendGenericMessage(sender)
        continue
      }
      if (text === 'Colors') {
        sendColors(sender)
        continue
      }
      sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
    }
    if (event.postback) {
      let text = JSON.stringify(event.postback)
      sendTextMessage(sender, text.substring(0, 200), token)
      continue
    }
  }
  res.sendStatus(200)
})

const token = "EAAD07NbRrUgBAFdDbyjacS2EyJHyXWIRkTH2WU0iu3gkcSgIzocvYNW8sBsBnFsdZCaNgODAvJZAeGW0kbHjol8sJmSaYjbNZCj9UGoz8a6YGm9N55k40Cg5JwoU7pTrnVFV0bK9GrvGcJFFCZBkYbsjbrpMARd5sQPwfrmVZBgZDZD"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}
// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
  setGreetingText();
})
