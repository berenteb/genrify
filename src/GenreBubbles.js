import React, { Component } from 'react'

export class GenreBubbles extends Component {
    render() {
        if(Array.isArray(this.props.genres)){
            var key = 0;
            this.items = this.props.genres.map((element)=>{
                key++;
                return <div className="genreBubble" key={key.toString()}>{element}</div>
            })
        }
        return this.items
    }
}

export default GenreBubbles
