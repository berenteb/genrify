const tracks_path = "/v1/tracks/"
const artist_path = "/v1/artists/"

const apiErrorTypes = {
    "NOT_FOUND": "404",
    "AUTH_FAIL": "auth_fail",
    "INVALID_GRANT": "invalid_grant",
    "PARSE_FAIL": "parse_fail",
    "TOKEN_EXPIRED": "token_expired",
    "NOT_LOGGED_IN": "not_logged_in"
}

function apiCall(path, token) {
    return new Promise((res,rej)=>{
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.spotify.com"+path);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer "+token);
        xhr.onreadystatechange = ()=>{
            if (xhr.readyState === 4) {
                var result = {};
                if(xhr.status === 200){
                    try{
                        result.data = JSON.parse(xhr.responseText);
                        res(result);
                    }catch(err){
                        result.error=apiErrorTypes.PARSE_FAIL
                        rej(result);
                    }
                }else if(xhr.status === 404){
                    result.error = apiErrorTypes.NOT_FOUND
                    rej(result)
                }else if(xhr.status === 401){
                    result.error = apiErrorTypes.TOKEN_EXPIRED
                    rej(result)
                }
            }
        }
        xhr.send();
    });
}

function getGenresForArtist(artist, token) {
    return new Promise((res,rej)=>{
        apiCall(artist_path+artist.id, token).then((result)=>{
            var genres = result.data.genres
            res(genres);
        }).catch(err=>{
            rej(err);
        })
    })
}

function getGenres(song,token) {
    return new Promise((res,rej)=>{
        apiCall(tracks_path+song, token).then((trackResult)=>{
            var trackInformation = {
                name: trackResult.data.name,
                artists: trackResult.data.artists,
                genres: []
            }
            if(Array.isArray(trackInformation.artists)){
                trackInformation.artists.forEach((artist)=>{
                    getGenresForArtist(artist,token).then((artistResult)=>{
                        artistResult.forEach((genre)=>{
                            trackInformation.genres.push(genre);
                        })
                        res(trackInformation);
                    }).catch(err=>{
                        rej(err);
                    })
                });
            }
        }).catch(err=>{
            rej(err);
        })
    })
}

module.exports = {
    getGenres: getGenres,
    apiErrorTypes: apiErrorTypes
};