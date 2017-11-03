/* eslint-disable no-undef */

import { browserHistory } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import './validation.js';

let component;

const upload = () => {
  const CSVFormat = document.querySelector('[name="radioCSVFormatGroup"]:checked').value;

  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
  if (regex.test($("#csvControlFile").val().toLowerCase())) {
      if (typeof (FileReader) != "undefined") {
          var reader = new FileReader();
          reader.onload = function (e) {
              var rows = e.target.result.split("\n");
              for (var i = 0; i < rows.length; i++) {
                console.log('file content -----------', rows[i]);
                 var cells = rows[i].split(",");
                for (var j = 0; j < cells.length; j++) {

                }

              }
          }
          reader.readAsText($("#csvControlFile")[0].files[0]);
      } else {
          alert("This browser does not support HTML5.");
      }
  } else {
      alert("Please upload a valid CSV file.");
  }
};

const validate = () => {
  $(component.uploadFileForm).validate({
    rules: {
      csvControlFile: {
        required: true,
      },
    },
    messages: {
      csvControlFile: {
        required: 'Select the CSV file',
      },
    },
    submitHandler() { upload(); },
  });
};

export default function handleUpload(options) {
  component = options.component;
  validate();
}
