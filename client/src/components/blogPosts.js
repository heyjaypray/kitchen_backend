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



 
          <Card>
            <CardBody>

                  <Label for="name">Title</Label>
                  <Input type="text" name="title" id="title" placeholder="Title" required />

                  <Label for="subject">Subject</Label>
                  <Input type="text" name="subject" id="subject" placeholder="Subject" required />


                  <Label for="post">Post</Label>
                  <Input type="textarea" name="post" id="post" style={{ height: 200 }} />

                <Button>Submit</Button>
          

            </CardBody>

          </Card>






    );
  }
}

export default Photos;
