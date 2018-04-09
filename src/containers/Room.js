import { Container } from 'unstated';

export default class RoomContainer extends Container {
  state = { room: "", user: "", color: "" };
}

export const roomContainer = new RoomContainer();
