import React, { Fragment, useRef, useState } from 'react';
import CSVFileValidator from 'csv-file-validator';
import Swal from 'sweetalert2';
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
  validateRequiredFields,
} from '../helpers/formatAndValidate';

const GenerateTable = () => {
  const inputRef = useRef('');

  const [tableHeading, setTableHeading] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  const selectFileAndParseCsv = async (e) => {
    // checking the extension of the file. If it's not CSV then alert the user and return
    if (e.target.value.split('.').pop() !== 'csv') {
      Swal.fire({
        title: 'Invalid File Extension',
        text: 'Only CSV files are accepted',
      });
      e.target.value = '';
      setTableHeading('');
      setTableRows('');
      return;
    }

    const config = {
      headers: [
        {
          inputName: 'fullName',
        },
        {
          inputName: 'phone',
        },
        {
          inputName: 'email',
        },
        {
          inputName: 'age',
        },
        {
          inputName: 'experience',
        },
        {
          inputName: 'yearlyIncome',
        },
        {
          inputName: 'hasChildren',
        },
        {
          inputName: 'licenseStates',
        },
        {
          inputName: 'expirationDate',
        },
        {
          inputName: 'licenseNumber',
        },
      ],
      isHeaderNameOptional: true,
    };

    const { data } = await CSVFileValidator(e.target.files[0], config);

    const email = data[0].email.toLowerCase();
    const fullName = data[0].fullName.toLowerCase();
    const phone = data[0].phone.toLowerCase();

    if (validateRequiredFields(email, fullName, phone) === false) {
      Swal.fire({
        title: 'Table Is Not Correct',
        text: 'Columns "Full Name" "Phone" "Email" are required',
      });
      e.target.value = '';
      setTableHeading('');
      setTableRows('');
      return;
    }

    const headings = data[0];
    // adding missing headings manually
    headings.ID = 'ID';
    headings.DuplicateWith = 'Duplicate With';

    setTableHeading([headings]);
    setTableRows(data.splice(1));
  };

  const hasDuplicates = (value, index) => {
    let array;

    if (isValidEmail(value)) {
      // if it's a valid email we're creating array of emails
      array = tableRows && tableRows.map((row) => row.email.toLowerCase());
    } else {
      // creating array of phones
      array = tableRows && tableRows.map((row) => row.phone.toLowerCase());
    }

    // detecting first duplicate value
    const duplicated =
      array.indexOf(value.toLowerCase()) !==
      array.lastIndexOf(value.toLowerCase());

    if (duplicated) {
      // if it's found AND it equals index that we received then return THE OTHER found index + 1 (ID)
      if (array.lastIndexOf(value.toLowerCase()) === index) {
        return array.indexOf(value.toLowerCase()) + 1;
      } else {
        return array.lastIndexOf(value.toLowerCase()) + 1;
      }
    }
  };

  const checkIfNaN = (value) => {
    return isNaN(value) ? '' : value;
  };

  const generateHeading = () => {
    if (tableHeading) {
      return tableHeading.map((heading, i) => {
        const {
          ID,
          fullName,
          DuplicateWith,
          age,
          email,
          experience,
          yearlyIncome,
          hasChildren,
          phone,
          licenseStates,
          licenseNumber,
          expirationDate,
        } = heading;
        return (
          <Fragment key={i}>
            <th> {ID} </th>
            <th> {fullName} </th>
            <th> {phone} </th>
            <th> {email} </th>
            <th> {age} </th>
            <th> {experience} </th>
            <th> {yearlyIncome} </th>
            <th> {hasChildren} </th>
            <th> {licenseStates} </th>
            <th> {expirationDate} </th>
            <th> {licenseNumber} </th>
            <th> {DuplicateWith} </th>
          </Fragment>
        );
      });
    } else {
      return null;
    }
  };

  const generateTableRows = () => {
    if (tableRows) {
      return tableRows.map((row, i) => {
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
        const incomeInt = checkIfNaN(
          parseFloat(yearlyIncome.trim()).toFixed(2)
        );
        const hasChildBool = convertHasChildren(hasChildren.trim());
        const expDate = expirationDate.trim();
        const licNum = licenseNumber.trim();

        return (
          <tr key={i}>
            <td> {i + 1} </td>
            <td> {fullNameStr} </td>
            <td
              className={`${
                hasDuplicates(phoneStr) && 'red-highlight'
              }  ${validatePhoneNumber(phoneStr)}`}
            >
              {formatPhoneNumber(phoneStr)}
            </td>
            <td
              className={`${hasDuplicates(emailStr) && 'red-highlight'} ${
                !isValidEmail(emailStr) && 'red-highlight'
              }`}
            >
              {emailStr}
            </td>
            <td className={validateAge(ageInt)}>{ageInt}</td>
            <td className={validateExperience(expInt, ageInt)}>{expInt}</td>
            <td className={validateIncome(incomeInt)}>{incomeInt}</td>
            <td className={validateHasChildren(hasChildBool)}>
              {hasChildBool}
            </td>
            <td className={validateStates(licenseStates)}>
              {convertStates(licenseStates)}
            </td>
            <td className={validateDate(expDate)}>{expDate}</td>
            <td className={validateLicense(licNum)}>{licNum}</td>
            <td> {hasDuplicates(phone, i)} </td>
          </tr>
        );
      });
    } else {
      return null;
    }
  };

  return (
    <div className='container'>
      <button
        onClick={(e) => inputRef.current.click()}
        className='import-button'
      >
        Import Users
      </button>
      <input
        ref={inputRef}
        hidden={true}
        type='file'
        onChange={(e) => selectFileAndParseCsv(e)}
      />
      <table className='table'>
        <thead>
          <tr>{generateHeading()}</tr>
        </thead>
        <tbody>{generateTableRows()}</tbody>
      </table>
    </div>
  );
};

export default GenerateTable;
