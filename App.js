/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Button,
  Text,
  Dimensions,
  StatusBar,
  ToastAndroid
} from 'react-native';

import { ColorWheel } from 'react-native-color-wheel';
import Slider from '@react-native-community/slider';

function hsvToRgb(h, s, v) {
  var r, g, b;
  var i;
  var f, p, q, t;

  // Make sure our arguments stay in-range
  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(100, s));
  v = Math.max(0, Math.min(100, v));

  // We accept saturation and value arguments from 0 to 100 because that's
  // how Photoshop represents those values. Internally, however, the
  // saturation and value are calculated from a range of 0 to 1. We make
  // That conversion here.
  s /= 100;
  v /= 100;

  if (s == 0) {
    // Achromatic (grey)
    r = g = b = v;
    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  }

  h /= 60; // sector 0 to 5
  i = Math.floor(h);
  f = h - i; // factorial part of h
  p = v * (1 - s);
  q = v * (1 - s * f);
  t = v * (1 - s * (1 - f));

  switch (i) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;

    case 1:
      r = q;
      g = v;
      b = p;
      break;

    case 2:
      r = p;
      g = v;
      b = t;
      break;

    case 3:
      r = p;
      g = q;
      b = v;
      break;

    case 4:
      r = t;
      g = p;
      b = v;
      break;

    default: // case 5:
      r = v;
      g = p;
      b = q;
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];
}


export default class App extends Component {

  // Initializes testval and testItem.
  constructor(props) {
    super(props);
    this.state = { colour: [255, 255, 255], brightness: 100 };
  }
  showToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };


  updateLEDS() {
    console.log("Update LEDS!")

    this.showToast("Updating LEDS!");

    let r = this.state.colour[0];
    let g = this.state.colour[1];
    let b = this.state.colour[2];
    console.log(r);

    fetch(`https://updateleds.azurewebsites.net/api/updateLEDS?r=${r}&g=${g}&b=${b}&d=false&br=${this.state.brightness}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

  }

  brightnessChange = (b) => {
    this.setState({ brightness: Math.round(b) })
  }
  onChange = (color) => {
    // colour = HSVtoRGB(color.h, color.s, color.v)
    let h = color.h;
    if (h < 0) {
      h = 360 - Math.abs(h);
    }

    let rgb = hsvToRgb(h, color.s, color.v);
    // this.colour = rgb;

    this.setState({ colour: rgb })

  }

  render(props) {
    return (
      <View style={{ display: "flex", flex: 1, paddingBottom: "80%", width: "100%", justifyContent: "center" }}>
        <ColorWheel
          initialColor="#ee0000"
          onColorChange={color => this.onChange(color)}
          onColorChangeComplete={color => this.onChange(color)}
          style={{ width: Dimensions.get('window').width }}
          thumbStyle={{ height: 30, width: 30, borderRadius: 30 }}
        />

        <Slider
          style={{ width: "80%", marginRight: "auto", marginLeft: "auto" }}
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor="#FFFF00"
          maximumTrackTintColor="#FFFFFF"
          value={100}
          step={1}
          onValueChange={value => this.brightnessChange(value)}
        />
        <View>
          <Text style={{ textAlign: "center", width: "100%" }}>({`R: ${this.state.colour[0]}, G: ${this.state.colour[1]}, B: ${this.state.colour[2]}`})</Text>
          <Text style={{ textAlign: "center", width: "100%" }}>{`Brightness: ${this.state.brightness}%`}</Text>

        </View>
        <View style={{ width: "80%", marginLeft: "auto", marginRight: "auto", paddingTop: "20%" }}>
          <Button
            onPress={this.updateLEDS.bind(this)}
            title="Set Colour"
            color="#841584"
          />
        </View>

      </View>
    );
  }


}

// const styles = new StyleSheet.create({

//   container: {
//     display: "flex",
//     flexDirection: "column"
//   }


// });



