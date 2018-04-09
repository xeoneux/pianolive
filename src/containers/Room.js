import { Container } from 'unstated';

export default class RoomContainer extends Container {
  state = { room: null };
}

export const roomContainer = new RoomContainer();
