import React from 'react';

import './Piano.css';

export default class Piano extends React.Component {
  render() {
    return (
      <div className="Piano">
        <ul>
          {this.props.keys.state.notes.map(note => (
            <li
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
