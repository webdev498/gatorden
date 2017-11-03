/* eslint-disable no-undef */

import { Bert } from 'meteor/themeteorchef:bert';
import { upsertWorkday } from '../api/workdays/methods';
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
                var cells = rows[i].split(",");
                if (CSVFormat == 0) { // Letter day
                    if (cells.length != 4) {
                        component.uploadFileForm.reset();
                        Bert.alert('CSV format is not working for letter days', 'danger');
                        return;
                    }

                    var date = cells[1];
                    var letter = cells[2];
                    var daytype = cells[3];

                    if (date && letter) {
                        daytype = daytype ? daytype : '';
                        const workday = {
                            dates : date.trim(),
                            alphabet: letter,
                            daytype: daytype
                        };
                        
                        upsertWorkday.call(workday);
                    }
                }
                else {
                    component.uploadFileForm.reset();
                    Bert.alert('CSV format is invalid', 'danger');
                    return;
                }
              }

              const CSVTitle = CSVFormat == 0 ? 'Letter days' : 'Events';
              Bert.alert('Successfully imported the CSV for ' + CSVTitle, 'success');
              component.uploadFileForm.reset();
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
