import React from 'react';
import io from 'socket.io-client';
import { Subscribe } from 'unstated';
import Soundfont from 'soundfont-player';

import './App.css';
import Piano from './Piano/Piano';
import { getRandomName, getRandomColor } from '../tools/Random';
import KeysContainer, { keysContainer } from '../containers/Keys';
import RoomContainer, { roomContainer } from '../containers/Room';

const nameDynamicStyle = color => ({
  textShadow: `0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${color}, 0 0 30px ${color}`
});

export default class App extends React.Component {
  state = { player: null, socket: null, modal: false };

  toggle = (note, state, emit) => {
    if (note) {
      keysContainer.toggleNote(note, state);

      const socket = this.state.socket;
      if (emit && socket) {
        socket.emit(state ? 'noteOn' : 'noteOff', note);
      }

      const player = this.state.player;
      if (note.includes('s')) note = note[0] + '#';
      if (state && player) player.play(note.toUpperCase() + '4');
    }
  };

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
    this.toggle(note, false, true);
  };

  handleKeyDown = event => {
    let note = this.getNoteFromEvent(event);
    this.toggle(note, true, true);
  };

  componentWillMount() {
    const AC = window.AudioContext || window.webkitAudioContext;
    Soundfont.instrument(new AC(), 'acoustic_grand_piano').then(piano => {
      this.setState(
        { player: piano, socket: io('http://localhost:4000/') },
        () => {
          const socket = this.state.socket;
          if (socket) {
            socket.on('noteOn', note => this.toggle(note, true, false));
            socket.on('noteOff', note => this.toggle(note, false, false));
          }
        }
      );
    });
  }

  componentDidMount() {
    this.setState({ modal: true });
    roomContainer.setState({ user: getRandomName(), color: getRandomColor() });
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
          {keys => <Piano keys={keys} toggle={this.toggle} />}
        </Subscribe>
        <Subscribe to={[RoomContainer]}>
          {room => (
            <form>
              <input
                className="Name"
                style={nameDynamicStyle(room.state.color)}
                value={room.state.user}
                onChange={event => {
                  roomContainer.setState({ user: event.target.value });
                }}
              />
            </form>
          )}
        </Subscribe>
      </div>
    );
  }
}
