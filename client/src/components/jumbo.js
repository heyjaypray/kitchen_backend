import React from 'react';
import { Jumbotron, Button } from 'reactstrap';

const Jumbo = (props) => {
  return (
    <div>
      <Jumbotron>
        <h1 className="display-3">Welcome!</h1>
        <p className="lead">This is your user interface for uploading and deleting photos for your website - as well as manage reviews.</p>
        <hr className="my-2" />
        <p>For help please contact justin@thinkthoughtmedia.com </p>
        <p className="lead">
          <Button color="primary">Contact</Button>
        </p>
      </Jumbotron>
    </div>
  );
};

export default Jumbo;