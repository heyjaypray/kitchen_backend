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

import BlogPosts from './blogPosts'



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
    <div>


      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <Card>
            <CardBody>
              <Form>
                <FormGroup>
                  <Label for="name">Title</Label>
                  <Input type="text" name="title" id="title" placeholder="Title" required />
                </FormGroup>
                <FormGroup>
                  <Label for="subject">Subject</Label>
                  <Input type="text" name="subject" id="subject" placeholder="Subject" required />
                </FormGroup>

                <FormGroup>
                  <Label for="post">Post</Label>
                  <Input type="textarea" name="post" id="post" style={{ height: 200 }} />
                </FormGroup>

                <Button>Submit</Button>
              </Form>

            </CardBody>

          </Card>
          <br />
          <br />
          <br />

          {/* <BlogPosts /> */}

        </Col>

        
        

      </Row>




      </div>





    );
  }
}

export default Photos;
