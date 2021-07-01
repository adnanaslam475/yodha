import React from 'react';
// import Navigator from './adminNavigator/navigation'
import { LogBox } from 'react-native';

import FlowerNavigator from './adminNavigator/FlowerNavigator'
import 'react-native-gesture-handler'

LogBox.ignoreLogs(['Setting a timer for a long period of time'])
const App = () => {
  return <FlowerNavigator />
}


export default App;
