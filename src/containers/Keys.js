import { Container } from 'unstated';

export default class KeysContainer extends Container {
  state = {
    notes: ['c', 'cs', 'd', 'ds', 'e', 'f', 'fs', 'g', 'gs', 'a', 'as', 'b']
      .reverse()
      .map(note => ({
        name: note,
        color: 'red',
        active: false
      }))
  };

  toggleNote = (key, color, active) => {
    this.setState({
      notes: this.state.notes.map(note => {
        if (key === note.name)
          return Object.assign({}, note, { color, active });
        return note;
      })
    });
  };
}

export const keysContainer = new KeysContainer();
