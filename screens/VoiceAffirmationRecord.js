import React, { Component } from 'react'
import { TouchableOpacity, View, Text } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';



const audioRecorderPlayer = new AudioRecorderPlayer();
export default class VoiceAffirmationRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPositionSec: null,
            currentDurationSec: null,
            playTime: null,
            duration: null,
            recordSecs: 0,
            recordTime: 0,
        }
    }

    onStartRecord = async () => {
        try {
            const result = await audioRecorderPlayer.startRecorder();
            audioRecorderPlayer.addRecordBackListener((e) => {
                this.setState({
                    recordSecs: e.currentPosition,
                    recordTime: audioRecorderPlayer.mmssss(
                        Math.floor(e.currentPosition),
                    ),
                });
                return;
            });
            console.log('res------------>', result);
        } catch (error) {
            console.log('err', error)
        }
    };

    onStopRecord = async () => {
        try {
            const result = await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
            this.setState({
                recordSecs: 0,
            });
            console.log('res==========->', result);
        } catch (error) {
        }
    };

    onStartPlay = async () => {
        try {
            const msg = await audioRecorderPlayer.startPlayer();
            console.log(msg);
            audioRecorderPlayer.addPlayBackListener((e) => {
                this.setState({
                    currentPositionSec: e.currentPosition,
                    currentDurationSec: e.duration,
                    playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
                    duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
                })
                return;
            });
        } catch (error) {
            console.log('err72', error)
        }
    };

    onPausePlay = async () => {
        try {
            await audioRecorderPlayer.pausePlayer();
        } catch (error) {
            console.log('err82', error)
        }
    };

    onStopPlay = async () => {
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
    };

    render() {
        return (
            <View>
                <TouchableOpacity onPress={this.onStartRecord}
                    style={{ height: 50, backgroundColor: 'red' }} >
                    <Text>recorder</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
