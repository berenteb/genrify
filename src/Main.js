import React, { Component } from 'react'
import GenreBubbles from './GenreBubbles'
import NavBar from './Navbar';
import { getGenres, apiErrorTypes } from './WebApi'
import { getToken, login, authTypes } from "./Auth.js"
import LoadingGif from './loading.gif'

export class Main extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.labelRef = React.createRef();
        this.loadingRef = React.createRef();
        this.errorContainerRef = React.createRef();
        this.errorTextRef = React.createRef();
    }
    state = {
        refresh_token: localStorage.getItem("refresh_token") || undefined,
        access_token: localStorage.getItem("access_token") || undefined,
        track: {
            name: "",
            artists: [],
            genres: []
        },
        isLoggedIn: false
    }

    getInfo() {
        if(!this.state.isLoggedIn){
            this.handleError(apiErrorTypes.NOT_LOGGED_IN);
            return;
        }
        var idArray = /([A-Za-z0-9]){22}/.exec(this.inputRef.current.value) || [];
        if (this.state.access_token) {
            this.loadingRef.current.hidden = false;
            getGenres(idArray[0] || "4uLU6hMCjMI75M1A2tKUQC", this.state.access_token).then((result) => {
                this.loadingRef.current.hidden = true;
                this.setState({ track: result });
            }).catch((err) => {
                this.loadingRef.current.hidden = true;
                this.handleError(err.error)
            })
        } else {
            if (this.state.refresh_token || this.state.code) {
                getToken(this.state.refresh_token !== undefined, this.state.refresh_token !== undefined ? this.state.refresh_token : this.state.code).then((res) => {
                    localStorage.setItem("refresh_token", res.refresh_token);
                    localStorage.setItem("access_token", res.access_token);
                    var newState = this.state;
                    newState.access_token = res.access_token;
                    newState.refresh_token = res.refresh_token
                    this.setState(newState)
                }).catch(err => {
                    if (err === authTypes.errorTypes.LOGIN_REQUIRED) {
                        login()
                    }
                    else {
                        console.log("Unknow auth error");
                    }
                });
            } else {
                login();
            }
        }
    }

    componentDidMount() {
        var searchRaw = window.location.search;
        window.history.replaceState({}, document.title, "/");
        if (searchRaw) {
            var paramsRawString = searchRaw.substr(1);
            var paramsRawArray = paramsRawString.split("&");
            paramsRawArray.forEach((param) => {
                var paramSplit = param.split("=");
                var newState = this.state;
                switch (paramSplit[0]) {
                    case "error":
                        this.displayError("You need to grant permission in order to use this application!");
                        break;
                    case "code":
                        newState.code = paramSplit[1]
                        this.setState(newState);
                        break;
                    default:
                        this.displayError("Unknown error");
                        break;
                }
            })
        }
        if (!this.state.access_token) {
            if (this.state.refresh_token || this.state.code) {
                getToken(this.state.refresh_token !== undefined, this.state.refresh_token !== undefined ? this.state.refresh_token : this.state.code).then((res) => {
                    localStorage.setItem("refresh_token", res.refresh_token);
                    localStorage.setItem("access_token", res.access_token);
                    var newState = this.state;
                    newState.access_token = res.access_token;
                    newState.refresh_token = res.refresh_token;
                    newState.isLoggedIn = true;
                    this.setState(newState)
                }).catch(err => {
                    if (err === authTypes.errorTypes.LOGIN_REQUIRED) {
                        this.displayError("You need to sign in again!")
                    }
                    else {
                        this.displayError("An authentication error occured!");
                    }
                });
            }
        }else if(!this.state.isLoggedIn){
            this.setState({isLoggedIn: true});
        }
    }

    handleError(error) {
        switch (error) {
            case apiErrorTypes.INVALID_GRANT:
                this.displayError("You need to sign in again!")
                break;
            case apiErrorTypes.NOT_LOGGED_IN:
                this.displayError("You need to sign in with Spotify to use this application!");
                break;
            case apiErrorTypes.NOT_FOUND:
                this.displayError("Could not get info about this song.");
                break;
            case apiErrorTypes.PARSE_FAIL:
                this.displayError("Spotify response parse fail. You've just found a bug in this app!");
                break;
            case apiErrorTypes.TOKEN_EXPIRED:
                getToken(true, this.state.refresh_token).then(res => {
                    localStorage.setItem("refresh_token", res.refresh_token);
                    localStorage.setItem("access_token", res.access_token);
                    var newState = this.state;
                    newState.access_token = res.access_token;
                    newState.refresh_token = res.refresh_token
                    this.setState(newState)
                }).catch(err => {
                    if (err === authTypes.errorTypes.LOGIN_REQUIRED) {
                        this.displayError("You need to sign in again!")
                    }
                    else {
                        this.displayError("An authentication error occured!");
                    }
                });
                break;
            default:
                this.displayError("New type of error: " + error)
                break;
        }
    }

    logout() {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        this.setState({ access_token: undefined, refresh_token: undefined, isLoggedIn: false });
    }

    displayError(message){
        this.errorTextRef.current.innerHTML = message;
        this.errorContainerRef.current.style.display = "inline-flex";
    }

    hideError(){
        this.errorTextRef.current.innerHTML = "There are no errors, so this is an error!";
        this.errorContainerRef.current.style.display = "none";
    }

    render() {
        return (
            <div className="App">
                <div className="errorContainer" ref={this.errorContainerRef}>
                    <div className="errorMessage" onClick={this.hideError.bind(this)}>
                        <h2 className="errorText" ref={this.errorTextRef}>Empty</h2>
                        <p>Click to dismiss!</p>
                    </div>
                </div>
                <NavBar logout={this.logout.bind(this)} isLoggedIn={this.state.isLoggedIn} />
                <div className="searchContainer">
                    <div className="searchContent">
                        <h2 className="searchTitle">Please paste in a Spotify URL, Song ID or Song URI</h2>
                        <div className="searchInputContainer">
                            <input className="searchField searchInput" placeholder="https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC?si=76ifkicRR5K8WQUxfMZXrQ" type="text" ref={this.inputRef} />
                            <button className="button searchButton searchInput" onClick={this.getInfo.bind(this)}>Get</button>
                        </div>
                        <img className="loadingGif" src={LoadingGif} alt="Getting info..." draggable="false" hidden={true} ref={this.loadingRef}></img>
                        <p className="resultLabel" ref={this.labelRef}>{this.state.track.name || ""}</p>
                        <div className="bubblesContainer">
                            <GenreBubbles genres={this.state.track.genres} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Main
