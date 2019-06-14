import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo';


export default class AccelerometerSensor extends React.Component {
  state = {
    accelerometerData: { x: 0, y: 0, z: 0 },
  };
  _subscription: any;

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  };

  _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  _fast = () => {
    Accelerometer.setUpdateInterval(
      16
    );
  };

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(
      accelerometerData => {
        fetch('http://192.168.100.4:3000/1', {
          method: 'POST',
          // headers: {
          //   Accept: 'application/json',
          //   'Content-Type': 'application/json',
          // },
          body: JSON.stringify(accelerometerData),
        });
        this.setState({ accelerometerData });
      })
  }

  _unsubscribe = () => {
    this
      ._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    let {
      x,
      y,
      z,
    } = this.state.accelerometerData;
    return (
      <View style={styles.sensor}>
        <Text>Accelerometer:</Text>
        <Text>
          x: {round(x)} y: {round(y)} z: {round(z)}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
            <Text>Toggl e</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});