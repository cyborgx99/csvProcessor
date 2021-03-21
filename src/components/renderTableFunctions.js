import { Fragment } from 'react';
import {
  isValidEmail,
  validateAge,
  validateExperience,
  validateIncome,
  convertStates,
  validateStates,
  formatPhoneNumber,
  validatePhoneNumber,
  validateDate,
  validateLicense,
  validateHasChildren,
  convertHasChildren,
  checkIfNaN,
  hasDuplicates,
} from '../helpers/formatAndValidate';

export const generateTableRows = (tableRowsArray) => {
  if (tableRowsArray) {
    return tableRowsArray.map((row, i) => {
      const {
        fullName,
        age,
        email,
        experience,
        yearlyIncome,
        hasChildren,
        phone,
        licenseStates,
        licenseNumber,
        expirationDate,
      } = row;

      const fullNameStr = fullName.trim();
      const phoneStr = phone.trim();
      const emailStr = email.trim();
      const ageInt = checkIfNaN(parseInt(age.trim()));
      const expInt = checkIfNaN(parseInt(experience.trim()));
      const incomeInt = checkIfNaN(parseFloat(yearlyIncome.trim()).toFixed(2));
      const hasChildBool = convertHasChildren(hasChildren.trim());
      const expDate = expirationDate.trim();
      const licNum = licenseNumber.trim();

      return (
        <tr key={i}>
          <td> {i + 1} </td>
          <td> {fullNameStr} </td>
          <td
            className={`${
              hasDuplicates(tableRowsArray, phoneStr) && 'red-highlight'
            }  ${validatePhoneNumber(phoneStr)}`}
          >
            {formatPhoneNumber(phoneStr)}
          </td>
          <td
            className={`${
              hasDuplicates(tableRowsArray, emailStr) && 'red-highlight'
            } ${!isValidEmail(emailStr) && 'red-highlight'}`}
          >
            {emailStr}
          </td>
          <td className={validateAge(ageInt)}>{ageInt}</td>
          <td className={validateExperience(expInt, ageInt)}>{expInt}</td>
          <td className={validateIncome(incomeInt)}>{incomeInt}</td>
          <td className={validateHasChildren(hasChildBool)}>{hasChildBool}</td>
          <td className={validateStates(licenseStates)}>
            {convertStates(licenseStates)}
          </td>
          <td className={validateDate(expDate)}>{expDate}</td>
          <td className={validateLicense(licNum)}>{licNum}</td>
          <td>
            {hasDuplicates(tableRowsArray, phone, i) ||
              hasDuplicates(tableRowsArray, email, i)}
          </td>
        </tr>
      );
    });
  } else {
    return null;
  }
};

export const generateHeading = (headingArray) => {
  if (headingArray) {
    return headingArray.map((heading, i) => {
      return (
        <Fragment key={i}>
          <th> {heading.ID} </th>
          <th> {heading.fullName} </th>
          <th> {heading.phone} </th>
          <th> {heading.email} </th>
          <th> {heading.age} </th>
          <th> {heading.experience} </th>
          <th> {heading.yearlyIncome} </th>
          <th> {heading.hasChildren} </th>
          <th> {heading.licenseStates} </th>
          <th> {heading.expirationDate} </th>
          <th> {heading.licenseNumber} </th>
          <th> {heading.DuplicateWith} </th>
        </Fragment>
      );
    });
  } else {
    return null;
  }
};
