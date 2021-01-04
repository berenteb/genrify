const clientid = process.env.REACT_APP_CLIENTID;
const base64 = process.env.REACT_APP_BASE64;
const redirect = process.env.REACT_APP_REDIRECT;

const authTypes = {
    "ERROR": "error",
    "ACCESS_TOKEN": "access_token",
    "REFRESH_TOKEN": "refresh_token",
    errorTypes:{
        "LOGIN_REQUIRED":"login_required",
        "UNKNOWN":"unknown"
    }
}

function login() {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientid}&response_type=code&redirect_uri=${redirect}`
}

function getToken(isRefresh, token) {
    return new Promise((res, rej) => {
        if (token) {
            var body = `grant_type=${isRefresh ? "refresh_token&refresh_token" : "authorization_code&code"}=${token}&redirect_uri=${redirect}`;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://accounts.spotify.com/api/token");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Authorization", `Basic ${base64}`);
            xhr.onreadystatechange = () => {
                if(xhr.readyState === 4){
                    if (xhr.status === 200) {
                        try {
                            var resJson = JSON.parse(xhr.responseText);
                            var result = {
                                    access_token: resJson.access_token,
                                    refresh_token: resJson.refresh_token
                            }
                            res(result);
                        } catch (err) {
                            rej(authTypes.errorTypes.UNKNOWN)
                        }
                    } else if(xhr.status === 400 || xhr.status === 401) {
                        localStorage.removeItem("refresh_token");
                        rej(authTypes.errorTypes.LOGIN_REQUIRED)
                    } else {
                        rej(authTypes.errorTypes.UNKNOWN)
                    }
                }
            }
            xhr.send(body);
        } else {
            rej(authTypes.errorTypes.LOGIN_REQUIRED)
        }
    })
}

module.exports = {
    getToken: getToken,
    login: login,
    authTypes: authTypes
}