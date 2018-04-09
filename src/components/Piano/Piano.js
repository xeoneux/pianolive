import React, { Component } from 'react';

import './Piano.css';

export default class Piano extends Component {
  render() {
    return (
      <div className="Piano">
        <ul>
          {this.props.keys.state.notes.map(note => (
            <li
              onMouseDown={() => this.props.toggle(note.name, true, true)}
              onMouseOut={() => this.props.toggle(note.name, false, true)}
              onMouseUp={() => this.props.toggle(note.name, false, true)}
              className={
                note.name +
                (note.active ? ` active` : ``) +
                (note.name.includes('s') ? ` black` : ` white`)
              }
              key={note.name}
            />
          ))}
        </ul>
      </div>
    );
  }
}
