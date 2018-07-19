import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import axios from 'axios';



class Photos extends Component {
  constructor(props) {
    super(props);

    // this.toggle1 = this.toggle.bind(this);
    this.state = {


      name: [],
      email: [],
      rating: [],
      comments: [],


    };

  }



  render() {


    return (


      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <Card>
            <CardBody>
              <center>
              <h1>Welcome</h1>
              <h2>to your CMS system</h2>
              <p>
                Please select from the navigation bar the content you'd like to manage.
                <br />
                <br />
                <br />
                <br />
                If you have any questions or concerns please contact <a href="mailto:justin@thinkthoughtmedia.com">justin@thinkthoughtmedia.com</a>
              </p>
              </center>
            </CardBody>

          </Card>


        </Col>
      </Row>






    );
  }
}

export default Photos;
