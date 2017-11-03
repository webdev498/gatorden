import React from 'react';
import { Link } from 'react-router';
import { Radio, Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import handleSignup from '../../modules/signup';


function FieldGroup({ id, label, help, ...props }) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    );
}

export default class UploadFile extends React.Component {
  componentDidMount() {
    // handleSignup({ component: this });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="Uploadfile">
        <Row>
          <Col xs={ 12 } sm={ 6 } md={ 6 }>
            <h4 className="page-header">Upload CSV File</h4>
            <form
              ref={ form => (this.signupForm = form) }
              onSubmit={ this.handleSubmit }
            >
              <Row>
                <Col xs={ 6 } sm={ 6 }>
                  <FormGroup>
                    <ControlLabel>CSV Format</ControlLabel>
                  </FormGroup>
                </Col>
                <Col xs={ 6 } sm={ 6 }>
                  <FormGroup>
                    <Radio name="radioCSVFormatGroup">
                        Calendar Header(A Day, B Day ..)
                    </Radio>
                    <Radio name="radioCSVFormatGroup">
                        Scheduling Dates
                    </Radio>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col xs={ 12 } sm={ 12 }>
                    <FieldGroup
                        id="csvControlFile"
                        type="file"
                        label="Upload File"
                    />
                </Col>
              </Row>
              <Button type="submit" bsStyle="success">Upload</Button>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}
