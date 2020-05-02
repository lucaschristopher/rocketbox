import React from 'react';
import {YellowBox} from 'react-native';

import Routes from './routes';

YellowBox.ignoreWarnings(['Unrecognized WebSocket']);

export default class App extends React.Component {
  render() {
    return <Routes />;
  }
}
