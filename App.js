import React, {  useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import Navigator from './adminNavigator/navigation';
import { LogBox } from 'react-native';
import { useDispatch } from 'react-redux';
import 'react-native-gesture-handler';
import { getUsers,getDeviceId } from './store/userActions';


LogBox.ignoreLogs(['Setting a timer']);
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDeviceId())
    setTimeout(() => {
      RNBootSplash.hide({ fade: true });
    }, 0);
  }, [dispatch]);
  return <Navigator />
}

export default App;