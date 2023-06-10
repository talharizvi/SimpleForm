import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import {colors, zipcode_data} from './src/dataFile.json';
import Picker from '@ouroboros/react-native-picker';
import CustomButton from './src/CustomButton';
import RadioButton from './src/RadioButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {encode} from 'base-64';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [zipcodeValue, setZipcode] = useState('');
  const [cityValue, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [dobError, setDobError] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [clickCount, setClickCount] = useState(1);
  const [dataDisplay, setDataDisplay] = useState('');

  //formatting colors object in array with text and value keys as Picker accepts array in this format for npm package @ouroboros/react-native-picker
  const colorsFormatted = Object.entries(colors).map(([key, value]) => ({
    text: key,
    value,
  }));

  const [picker, setPicker] = useState(colorsFormatted[0]);
  const [labelColorStyle, setLabelColorStyle] = useState({});

  useEffect(() => {
    const selectedColor = picker.value || picker;
    const labelColor = selectedColor ? selectedColor : '#000';
    setLabelColorStyle({color: labelColor});
  }, [picker]);

  const formatMobileNumber = input => {
    if (input.length === 4 && !input.includes('-')) {
      return input + '-';
    } else {
      return input;
    }
  };

  const isFormEmpty = () => {
    return (
      name.trim() === '' ||
      email.trim() === '' ||
      mobile.trim() === '' ||
      dob.trim() === '' ||
      zipcodeValue.trim() === ''
    );
  };

  const fetchZipCode = text => {
    if (text.length === 3) {
      let filteredZipCode = zipcode_data.filter(item =>
        item.zipcode.includes(text),
      );
      const {zipcode, city, state} =
        filteredZipCode.length > 0 ? filteredZipCode[0] : {};
      if (zipcode && city && state) {
        setZipcode(zipcode);
        setCity(city);
        setStateValue(state);
      } else {
        setZipcode(text);
        setCity('');
        setStateValue('');
      }
    } else {
      setZipcode(text);
    }
  };

  const validateName = text => {
    if (!text) {
      setNameError('Name is required');
      setIsValid(false);
    } else if (!/^[A-Z\s']+$/i.test(name)) {
      setNameError(
        'Name should contain only alphabet characters, spaces, and apostrophes.',
      );
      setIsValid(false);
    } else {
      setNameError('');
      setIsValid(true);
    }
    setName(text);
  };

  const validateEmail = text => {
    if (!text) {
      setEmailError('Email is required.');
      setIsValid(false);
    } else if (!/\S+@\S+\.\S+/.test(text)) {
      setEmailError('Please enter a valid email address.');
      setIsValid(false);
    } else {
      setEmailError('');
      setIsValid(true);
    }
    setEmail(text);
  };

  const validateMobile = text => {
    const formattedMobileNumber = formatMobileNumber(text);
    if (!text) {
      setMobileError('Mobile number is required.');
      setIsValid(false);
    } else if (!/^\d{4}-\d{6}$/.test(formattedMobileNumber)) {
      setMobileError('Please enter a valid mobile number.');
      setIsValid(false);
    } else {
      setMobileError('');
      setIsValid(true);
    }
    setMobile(formattedMobileNumber);
  };

  const validateDob = text => {
    if (!text) {
      setDobError('Date of birth is required.');
      setIsValid(false);
    } else if (!/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/.test(text)) {
      setDobError(
        'Please enter a valid date of birth in the format DD-MM-YYYY.',
      );
      setIsValid(false);
    } else {
      setDobError('');
      setIsValid(true);
    }
    setDob(text);
  };

  const validateZipcode = text => {
    if (!text) {
      setZipCodeError('Zipcode is required.');
      setIsValid(false);
    } else {
      setZipCodeError('');
      setIsValid(true);
    }
    fetchZipCode(text);
  };

  const showAlertWithFormData = formData => {
    const encodedData = encode(JSON.stringify(formData)); // Encode form data in Base64
    alert(`Form Data: ${encodedData}`);

    //to disable submit btn after submit btn is clicked
    setDisableSubmit(true);
    setIsValid(false);
  };

  const handleSubmit = async () => {
    if (isValid) {
      // Show loader for 2 seconds
      setIsLoading(true);

      // Store form data in local storage
      const formData = {
        name,
        email,
        mobile,
        dob,
        gender,
        zipcode: zipcodeValue,
        city: cityValue,
        state: stateValue,
      };
      try {
        await AsyncStorage.setItem('formData', JSON.stringify(formData));
      } catch (error) {
        console.warn('Error storing form data:', error);
      }

      setTimeout(() => {
        setIsLoading(false);
        showAlertWithFormData(formData);
      }, 2000);
    }
  };

  const handleShowData = () => {
    const clickMessage = `Click Count: ${clickCount}\n`;
    const formData = `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nDOB: ${dob}\nGender: ${gender}\nZipcode: ${zipcodeValue}\nCity: ${cityValue}\nState: ${stateValue}\nColor Picker: ${
      picker?.value ? picker.value : picker
    }\n\n`;

    const newDataDisplay = dataDisplay + clickMessage + formData;

    setDataDisplay(newDataDisplay);
    setClickCount(prevCount => prevCount + 1);
  };

  const handleReset = () => {
    // Reset form fields and errors on reset
    setName('');
    setEmail('');
    setMobile('');
    setDob('');
    setGender('Male');
    setZipcode('');
    setCity('');
    setStateValue('');
    setNameError('');
    setEmailError('');
    setMobileError('');
    setDobError('');
    setZipCodeError('');
    setPicker(colorsFormatted[0]);
    setDataDisplay('');
    setClickCount(1);
    setDisableSubmit(false);
    setIsValid(true);
  };

  return isLoading ? (
    <View style={styles.loaderView}>
      <ActivityIndicator size="small" color="#0000ff" />
    </View>
  ) : (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.titleContainer}>
        <Text style={[styles.titleText, labelColorStyle]}>Simple Form</Text>
      </View>
      <Text style={[styles.label, labelColorStyle]}>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={validateName}
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

      <Text style={[styles.label, labelColorStyle]}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={validateEmail}
        keyboardType="email-address"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <Text style={[styles.label, labelColorStyle]}>Mobile Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number (XXXX-XXXXXX)"
        value={mobile}
        onChangeText={validateMobile}
        keyboardType="phone-pad"
      />
      {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}

      <Text style={[styles.label, labelColorStyle]}>Date of Birth:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Date of Birth (DD-MM-YYYY)"
        value={dob}
        onChangeText={validateDob}
        keyboardType="phone-pad"
      />
      {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}

      <Text style={[styles.label, labelColorStyle]}>Gender:</Text>
      <View style={styles.radioContainer}>
        <RadioButton
          imageSource={
            gender === 'Male'
              ? require('./src/assets/selected-btn.png')
              : require('./src/assets/unselected-btn.png')
          }
          selected={gender === 'Male'}
          onPress={() => setGender('Male')}
          genderLabel="Male"
        />

        <RadioButton
          imageSource={
            gender === 'Female'
              ? require('./src/assets/selected-btn.png')
              : require('./src/assets/unselected-btn.png')
          }
          selected={gender === 'Female'}
          onPress={() => setGender('Female')}
          genderLabel="Female"
        />
      </View>

      <Text style={[styles.label, labelColorStyle]}>ZipCode:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter ZipCode"
        value={zipcodeValue}
        onChangeText={validateZipcode}
      />
      {zipCodeError ? (
        <Text style={styles.errorText}>{zipCodeError}</Text>
      ) : null}

      <Text style={[styles.label, labelColorStyle]}>City: {cityValue}</Text>

      <Text style={[styles.label, labelColorStyle]}>State: {stateValue}</Text>

      <Text style={[styles.label, labelColorStyle]}>
        Color Picker Dropdown:
      </Text>
      <Picker
        onChanged={item => {
          setPicker(item);
        }}
        options={colorsFormatted}
        style={styles.pickerStyle}
        value={picker?.value ? picker.value : picker}
      />

      <Text style={[styles.label, labelColorStyle]}>Desciption:</Text>
      <TextInput
        style={styles.multilineTextBox}
        value={dataDisplay}
        multiline={true}
        editable={false}
      />

      <CustomButton
        title="Submit"
        onPress={handleSubmit}
        disabled={!isValid || isFormEmpty()}
      />
      <CustomButton
        title="Show Data"
        onPress={handleShowData}
        disabled={!disableSubmit}
      />
      <CustomButton
        title="Reset"
        onPress={handleReset}
        disabled={!disableSubmit}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#d1cdcd',
  },
  loaderView: {
    flex: 1,
    backgroundColor: '#d1cdcd',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#211c1c',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  errorText: {
    color: '#eb1010',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  radioContainer: {
    marginBottom: 10,
  },
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
  pickerStyle: {
    borderWidth: 1,
    borderColor: '#211c1c',
    borderRadius: 5,
    marginBottom: 5,
    padding: 5,
  },
  scrollViewContent: {
    paddingBottom: 50, // Add padding to the bottom of the content
  },
  multilineTextBox: {
    borderColor: '#211c1c',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 10,
    textAlignVertical: 'top',
    borderRadius: 5,
    color: '#ffffff',
  },
});

export default App;
