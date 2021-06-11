import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  BackHandler,
  LogBox,
  Image,
  ToastAndroid,
  ScrollView,
} from "react-native";
import FloatingVideo from "rn-floating-video-widget";
import * as dummydata from './dummydata'
// import Video from 'react-native-video';

LogBox.ignoreAllLogs = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      floating: false,
      granted: false
    }
    this.data = {
      video: {
        url:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      },
      videos: [
        {
          url:
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        },
        {
          url:
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        },
        {
          url:
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        }
      ],
      seek: 10,
      index: 0
    };
  }

  componentDidMount() {
    FloatingVideo.onClose(data => console.log(data));
    FloatingVideo.onOpen(data => console.log(data));
    FloatingVideo.onPlay(data => console.log(data));
    FloatingVideo.onPause(data => console.log(data));
    FloatingVideo.onNext(data => console.log(data));
    FloatingVideo.onPrev(data => console.log(data));
    FloatingVideo.onError(data => console.log(data));
  }

  enterPipMode() {
    FloatingVideo.requestOverlayPermission()
      .then(() => {
        this.setState({
          floating: true,
          granted: true
        });
        FloatingVideo.open(this.data);
      })
      .catch(e => {
        ToastAndroid.show(
          "Please grant draw over other apps permission" + JSON.stringify(e),
          800
        );
      });
  }

  componentWillUnmount() {
    FloatingVideo.removeAllListeners();
  }

  render() {
    const { width } = this.props
    const { select } = this.state
    return (
      <ScrollView contentContainerStyle={styles.container} >
        <View>
          {dummydata.allvideos.map((v, i) => <TouchableOpacity key={i} style={{
            display: 'flex',
            flexDirection: 'row',
            borderWidth: 1,
            width: width / 3
          }} onPress={() => {
            this.setState({ select: v.url })
            this.enterPipMode();
          }}>
            <Image source={{ uri: v.img }}
              style={{ width: width * 0.2, height: 100 }} />
          </TouchableOpacity>)}
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    height: 100,
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  start: {
    width: "90%",
    alignSelf: "center",
    padding: 15,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    borderRadius: 5
  },
  button: {
    alignSelf: "center",
    padding: 5,
    borderWidth: 1,
    borderColor: "red",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    borderRadius: 5
  }
});