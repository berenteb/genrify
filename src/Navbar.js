import React, { Component } from 'react'
import Light from  "./Light.svg"
import {login} from './Auth'

export class Navbar extends Component {
    render() {
        return (
            <div className="navbarContainer">
                <img src={Light} className="navbarLogo" alt="" draggable="false"></img>
                <h1 className="mainTitle">Genrify for Spotify</h1>
                <h1 className="shortTitle">Genrify</h1>
                <button className="button authButton" onClick={this.props.isLoggedIn?this.props.logout:login}>{this.props.isLoggedIn?"Sign out":"Sign in with Spotify"}</button>
            </div>
        )
    }
}

export default Navbar
