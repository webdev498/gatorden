import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button } from 'react-bootstrap';
import DocumentsList from '../components/DocumentsList';

const Documents = () => (
  <div className="Documents">
    <Row>
      <Col xs={ 12 }>
        <h2 className="pull-left">Room Scheduler</h2>
      </Col>
      <Col xs={ 12 }>
        <div className="page-header clearfix">
          <h4 className="pull-left">List of Rooms</h4>
          <Link to="/documents/new">
            <Button
              bsStyle="success"
              className="pull-right"
            >New Room Schedule</Button>
          </Link>
        </div>
        <DocumentsList />
      </Col>
    </Row>
  </div>
);

export default Documents;
