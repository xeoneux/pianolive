import React, { Component } from 'react';

import './Piano.css';

import { getKeyForNote } from '../../tools/Marker';

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
              style={
                note.active
                  ? {
                      background: `linear-gradient(to bottom, #fff 0%, rgba(${
                        note.color
                      }, 0.7) 100%)`
                    }
                  : null
              }
              key={note.name}
            >
              <p className="text">
                {note.name.includes('s') ? '' : getKeyForNote(note.name)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
