import React, { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import {
  parseAndValidateCSV,
  validateRequiredFields,
} from '../helpers/formatAndValidate';
import { generateHeading, generateTableRows } from './renderTableFunctions';

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
      setTableHeading([]);
      setTableRows([]);
      return;
    }

    // parsing the file and receiving data
    const data = await parseAndValidateCSV(e.target.files[0]);
    console.log(data);

    if (data.length === 0) {
      Swal.fire({
        title: 'Something went wrong',
        text: 'Perhaps CSV file is not valid',
      });
      e.target.value = '';
      setTableHeading([]);
      setTableRows([]);
      return;
    }

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
          <tr>{generateHeading(tableHeading)}</tr>
        </thead>
        <tbody>{generateTableRows(tableRows)}</tbody>
      </table>
    </div>
  );
};

export default GenerateTable;
