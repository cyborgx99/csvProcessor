import states from 'us-state-converter';
import { isPossiblePhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import moment from 'moment';

export const validateRequiredFields = (email, fullName, phone) => {
  const requiredColumns = ['full name', 'email', 'phone'];

  if (
    requiredColumns.includes(email) &&
    requiredColumns.includes(fullName) &&
    requiredColumns.includes(phone)
  ) {
    return true;
  } else {
    return false;
  }
};

export const validateAge = (age) => {
  if (age < 21 && typeof age !== 'string') {
    return 'red-highlight';
  }
};

export const isValidEmail = (email) => {
  let re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validateExperience = (exp, age) => {
  if (exp > age || exp < 0) {
    return 'red-highlight';
  }
};

export const validateIncome = (income) => {
  if (income > 1000000) {
    return 'red-highlight';
  }
};

export const convertHasChildren = (value) => {
  if (value) {
    if (value === '0') {
      return 'FALSE';
    } else if (value === '1') {
      return 'TRUE';
    } else {
      return value;
    }
  }
};

export const validateHasChildren = (value) => {
  if (value) {
    if (value === 'TRUE' || value === 'FALSE') {
      return;
    } else {
      return 'red-highlight';
    }
  }
};

export const validateStates = (stateStr) => {
  const stateA = stateStr
    .trim()
    .split(/[ ,]+/)
    .filter(
      (state) =>
        // if it's bigger than 2 char AND we CANNOT find a valid US State, we return this value into the array
        (state.length > 2 &&
          states.abbr(state) ===
            'No abbreviation found with that state name') ||
        // or if it's the right format, BUT NOT a valid state (LL), we return it into the array
        (state.length === 2 &&
          states.fullName(state) === 'No state found with that abbreviation')
    );

  // if we have anything in the array there's an INVALID state or format
  if (stateA.length > 0) {
    return 'red-highlight';
  }
};

export const convertStates = (stateStr) => {
  if (stateStr) {
    // converting string of states separated by a comma or a space into an array
    // if it's not valid returning the value if it is converting into 2 letter format (FL)
    const stateA = stateStr.split(/[ ,]+/).map((state) => {
      if (states.abbr(state) === 'No abbreviation found with that state name') {
        return state;
      } else {
        return states.abbr(state);
      }
    });

    return stateA.join(' | ');
  }
};

export const formatPhoneNumber = (value) => {
  // formatting into a correct US phone number
  return parsePhoneNumber(value, 'US').number;
};

export const validatePhoneNumber = (value) => {
  if (isPossiblePhoneNumber(value, 'US')) {
    return undefined;
  } else {
    return 'red-highlight';
  }
};

export const validateDate = (value) => {
  if (value) {
    if (
      // checking if the values provided are of the expected format
      value === moment(value).format('YYYY-MM-DD') ||
      value === moment(value).format('MM/DD/YYYY')
    ) {
      // if the format is expected then Checking if it's NOT expired
      if (moment(value).isAfter(Date.now()) === true) {
        // return no className
        return undefined;
      }

      return 'red-highlight';
    } else {
      return 'red-highlight';
    }
  }
};

export const validateLicense = (value) => {
  if (value) {
    // regExp that checks that we have ONLY letters and numbers
    let lettersNumber = /^[0-9a-zA-Z]+$/;
    if (value.match(lettersNumber) && value.length === 6) {
      return undefined;
    } else {
      return 'red-highlight';
    }
  }
};
