const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SportifyWebApi = require('spotify-web-api-node');
const app = express();
const port = process.env.PORT || 3001;
const redirectUri = 'https://spotify-client-react.web.app'
// const redirectUri = 'http://localhost:3000'
app.use(cors())
app.use(bodyParser.json());
console.log('Server started')
app.post('/login', (req, res) => {
    const code = req.body.code
    console.log(code)
    const sportifyApi = new SportifyWebApi({
        redirectUri: redirectUri,
        clientId: 'ff076a0d549947e0a6e78532e2204bea',
        clientSecret: 'c4e0c7f1100f45d3919090e270e4f634'
    })
    sportifyApi.authorizationCodeGrant(code)
        .then(data => {
            console.log('Success Connect');
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch((err) => {
            console.log('Failed Connect');
            res.sendStatus(400)
        })
})

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const sportifyApi = new SportifyWebApi({
        redirectUri: redirectUri,
        clientId: 'ff076a0d549947e0a6e78532e2204bea',
        clientSecret: 'c4e0c7f1100f45d3919090e270e4f634',
        refreshToken
    })
    sportifyApi.refreshAccessToken()
        .then(data => {
            console.log('The Access Token has been refreshed');
            sportifyApi.setAccessToken(data.body.access_token)
        }
        )
        .catch(err => {
            res.sendStatus(400)
        })

})
app.listen(port)