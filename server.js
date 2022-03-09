const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SportifyWebApi = require('spotify-web-api-node');
const app = express();
const port = process.env.PORT || 3001;
app.use(cors())
app.use(bodyParser.json());
app.post('/login', (req, res) => {
    const code = req.body.code
    const redirectUri = req.body.redirect_uri
    const clientId = req.body.client_id
    const clientSecret = req.body.client_secret
    const sportifyApi = new SportifyWebApi({
        redirectUri: redirectUri || 'https://spotify-client-react.web.app',
        clientId: clientId || '96495a496bd743b28aeb95759eb85197',
        clientSecret: clientSecret || '8115c685b0134817b900e0a0de979952'
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
    const redirectUri = req.body.redirect_uri
    const clientId = req.body.client_id
    const clientSecret = req.body.client_secret
    const sportifyApi = new SportifyWebApi({
        redirectUri: redirectUri || 'https://spotify-client-react.web.app',
        clientId: clientId || '96495a496bd743b28aeb95759eb85197',
        clientSecret: clientSecret || '8115c685b0134817b900e0a0de979952',
        refreshToken
    })
    sportifyApi.refreshAccessToken()
        .then(data => {
            console.log('The Access Token has been refreshed');
            sportifyApi.setAccessToken(data.body.access_token)
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch(err => {
            res.sendStatus(400)
        })

})
app.listen(port)
