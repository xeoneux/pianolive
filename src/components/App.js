import React from 'react';
import io from 'socket.io-client';
import { Subscribe } from 'unstated';
import Soundfont from 'soundfont-player';

import './App.css';
import Piano from './Piano/Piano';
import KeysContainer, { keysContainer } from '../containers/Keys';

export default class App extends React.Component {
  state = { player: null, socket: null };

  getNoteFromEvent = event => {
    let note;
    if (event.key === 'z' || event.key === 'Z') note = 'c';
    if (event.key === 's' || event.key === 'S') note = 'cs';
    if (event.key === 'x' || event.key === 'X') note = 'd';
    if (event.key === 'd' || event.key === 'D') note = 'ds';
    if (event.key === 'c' || event.key === 'C') note = 'e';
    if (event.key === 'v' || event.key === 'V') note = 'f';
    if (event.key === 'g' || event.key === 'G') note = 'fs';
    if (event.key === 'b' || event.key === 'B') note = 'g';
    if (event.key === 'h' || event.key === 'H') note = 'gs';
    if (event.key === 'n' || event.key === 'N') note = 'a';
    if (event.key === 'j' || event.key === 'J') note = 'as';
    if (event.key === 'm' || event.key === 'M') note = 'b';
    return note;
  };

  handleKeyUp = event => {
    let note = this.getNoteFromEvent(event);
    if (note) {
      keysContainer.toggleNote(note, false);
      this.state.socket.emit('noteOff', note);
    }
  };

  handleKeyDown = event => {
    let note = this.getNoteFromEvent(event);
    if (note) {
      keysContainer.toggleNote(note, true);
      this.state.socket.emit('noteOn', note);
      if (note.includes('s')) note = note[0] + '#';
      this.state.player.play(note.toUpperCase() + '4');
    }
  };

  componentWillMount() {
    const AC = window.AudioContext || window.webkitAudioContext;
    Soundfont.instrument(new AC(), 'acoustic_grand_piano').then(piano => {
      this.setState(
        { player: piano, socket: io('http://localhost:4000/') },
        () => {
          this.state.socket.on('noteOn', note => {
            keysContainer.toggleNote(note, true);
            if (note.includes('s')) note = note[0] + '#';
            this.state.player.play(note.toUpperCase() + '4');
          });
          this.state.socket.on('noteOff', note => {
            keysContainer.toggleNote(note, false);
          });
        }
      );
    });
  }

  render() {
    return (
      <div
        tabIndex={1}
        className="App"
        onKeyUp={this.handleKeyUp}
        onKeyDown={this.handleKeyDown}
      >
        <Subscribe to={[KeysContainer]}>
          {keys => <Piano player={this.state.player} keys={keys} />}
        </Subscribe>
      </div>
    );
  }
}
