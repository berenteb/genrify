![Version: see package.json](https://img.shields.io/github/package-json/v/berenteb/genrify)
# Genrify
Genrify is a tool for Spotify. Just paste in a Spotify URL, Song URI or Song ID, and the app will list the genres associated with the song. This information is based on the authors of the song.
Try it out: [Genrify](http://genrify.berente.net)
## Authentication
You need to log in with Spotify. This is because Spotify only allows access to its database with client credidentials.
## Privacy
The client credidentials from Spotify is stored in the client's local storage. The server only serves the website, and it does not communicate with the client's browser, therefore the client's credidentals are not sent to or stored by the server. If they click the Sign out button, their credidentials will be deleted from their browser. Then they'll need to Sign in again in order to use this application.
## Environmental file
This app needs a .env file in the root directory in order to work.
```
REACT_APP_CLIENTID=<Spotify Client ID>
REACT_APP_BASE64=<base64 coded clientid:secret>
REACT_APP_REDIRECT=<redirect URL for login>
```
