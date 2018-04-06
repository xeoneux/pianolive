import React from 'react';

import './Piano.css';

export default class Piano extends React.Component {
  render() {
    return (
      <ul>
        <li class="white b" />
        <li class="black as" />
        <li class="white a" />
        <li class="black gs" />
        <li class="white g" />
        <li class="black fs" />
        <li class="white f" />
        <li class="white e" />
        <li class="black ds" />
        <li class="white d" />
        <li class="black cs" />
        <li class="white c" />
      </ul>
    );
  }
}
