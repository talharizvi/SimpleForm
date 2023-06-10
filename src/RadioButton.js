import React from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
const RadioButton = ({imageSource, selected, onPress, genderLabel}) => {
  return (
    <TouchableOpacity style={styles.radioButton} onPress={onPress}>
      <Image source={imageSource} style={[styles.radioButtonImage, selected]} />
      <Text>{genderLabel}</Text>
    </TouchableOpacity>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  radioButton: {
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonImage: {
    width: 25,
    height: 25,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
  },
});
