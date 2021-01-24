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
# ISC License (ISC)
Copyright 2021 Bálint Berente

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
