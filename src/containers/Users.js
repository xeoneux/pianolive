import { Container } from 'unstated';

export default class UsersContainer extends Container {
  state = { users: [] };
}

export const usersContainer = new UsersContainer();
