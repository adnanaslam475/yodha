import React, { useEffect } from 'react';
import {
  View,
  Alert,
  LogBox,
  AppRegistry,
} from 'react-native';
import Navigator from './Navigator/MainNavigator';
import { useDispatch, useSelector } from 'react-redux'
import { pushallaffirmation } from './redux/actions'
import { db, createTable } from './screens/Sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage';
LogBox.ignoreLogs(['If you want to use Reanimated 2 then go through our installation steps https://docs.swmansion.com/react-native-reanimated/docs/installation'])



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const func = async () => {
      const res = await AsyncStorage.getItem('save');
      console.log('sto', res)
      if (!res) {
        // dispatch(pushallaffirmation())
      }
    }
    func()
  }, [])
  return <Navigator />
};


export default App;
