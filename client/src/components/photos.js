import React, { Component } from "react";
import {
    Row,
    Col,
    Button,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardSubtitle,
    CardBody,
    Collapse,
    Form,
    FormGroup,
    FormText,
    Label,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    Table,
    Badge,
    Alert,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
// import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import API from '../api/api';
import axios from 'axios';
import errorHandle from '../util/error';
import FileReaderInput from 'react-file-reader-input';
import Gallery from 'react-grid-gallery';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner'



class Photos extends Component {
    constructor(props) {
        super(props);

        // this.toggle1 = this.toggle.bind(this);
        this.state = {

            collapse: true,
            edit: false,
            data: [],
           
            category:[],

            refId:[],

            initialData:{},
            modifiedData:{},

            modal: false,
            removeModal: false,

            images: [],
            images2: [],
            selectAllChecked: false,
            selectedImages: [],

            photoFile: [],

            loader: true

        };
        this.onSelectImage = this.onSelectImage.bind(this);
        this.getSelectedImages = this.getSelectedImages.bind(this);
    }

    onSelectImage (index, image) {
        var images = this.state.images.slice();
        var img = images[index];
        if(img.hasOwnProperty("isSelected"))
            img.isSelected = !img.isSelected;
        else
            img.isSelected = true;

        this.setState({
            images: images
        });
        this.getSelectedImages()
    }

    getSelectedImages () {
        var selected = [];
        this.setState({selectedImages: selected})
        for(var i = 0; i < this.state.images.length; i++)
            if(this.state.images[i].isSelected == true)
                selected.push(this.state.images[i]);
        return selected;
    }


    load = async () => {
        try { 
            await API
            .get()
            .then(res => {
                console.log("response: ")
                console.log(res)
                this.setState({ data: [...res.data], loader: false });
                this.setState({ category: "Kitchens" })
            })

            await this.setImages()

        } catch (errorHandle) {
            console.error(errorHandle);
        }
           
    };


    componentDidMount() {
        const promises = [
            this.load()
        ];

        Promise.all(promises)
    }

    setImages = async () => {
        var selected = [];
        for(var i = 0; i < this.state.data.length; i++)
           await selected.push({
                "_id": this.state.data[i]._id,
                "src": this.state.data[i].photo.url,
                "thumbnail": this.state.data[i].photo.url,
                "thumbnailWidth": 100,
                "thumbnailHeight": 100,
                "tags": [{value: this.state.data[i].category, title: this.state.data[i].category}]
            });

            await console.log(selected)

            await this.setState({images: selected})

        return selected;
      
    }




    postPhoto = () => {
        axios.get("/photos")
    }

    handleAdd = async (e) => {

        if (this.state.photoFile.length < 1) {
            e.preventDefault()

        } else {
            e.preventDefault();    
        
        this.setState({ loader: true })

       const add = {
           "category": this.state.category,
       }
      try {
        const res = await axios.post('/photos', add);

        const ref = await this.setState({ refId: res.data._id })

        const data = new FormData();
        data.append('files', this.state.photoFile);
        data.append('refId', this.state.refId);
        data.append('ref', "photos");
        data.append('field', "photo");

        const postPhoto = await axios.post('/upload', data);
        console.log(postPhoto);

        await document.getElementById("fileUpload").reset();
        await this.load()
        
       
        


      } catch (errorHandle) {
        console.error(errorHandle);
      }
        }

        

    }

    remove = () => {

        const map = this.state.selectedImages.map((i) => {
            API
                .delete(i._id)
                .then(res => console.log(res.data))
                .then(this.setState({ selectedImages: [] }))
                .then(this.load())
        })
    }

    handlePhoto = (e) => {
        this.setState({photoFile: e.target.files[0]})
    }

    handleName = (e) => {
        this.setState({ category: e.target.value })
    }




    render() {

        console.log("photo: " + JSON.stringify(this.state.selectedImages))
        let data;

        if (this.state.loader){
            data = 

            <div>

            <Row>
                <Col sm="12" md={{ size: 8, offset: 2 }}>

                    <Col sm="3">
                    <form
                        onSubmit={this.handleAdd}
                        id="fileUpload"
                    >
                        <FormGroup>
                            <Label for="exampleFile">File Upload</Label>
                            <Input type="file" name="file" id="exampleFile" onChange={this.handlePhoto} />
                            <Label htmlFor="category">Category</Label>
                                <Input
                                    type="select"
                                    name="category"
                                    id="category"
                                    placeholder="Category"
                                    required
                                    onChange={this.handleName}
                                >
                                    <option value="Kitchens">Kitchens</option>
                                    <option value="Refacing">Refacing</option>
                                    <option value="Cabinets">Cabinets</option>
                                    <option value="Bathrooms">Bathrooms</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Happy_Customers">Happy Customers</option>
                        
                                </Input>
                            <FormText color="muted">
                                To Add Photos, Please Choose Your File, Then Press "Add"<br />
                                To Delete, Please Select Your Photos with the Checkbox, Then Press Delete<br />
                            </FormText>
                            <Button color="primary">Add</Button>
                            <Button color="danger" onClick={this.remove} >Delete</Button>
                        </FormGroup>
                    </form>
                    </Col>
                
            
                </Col>
            </Row>

            <Row>
                    <Col sm="5" />
                        
                    <Col>
                    <Loader 
                        type="TailSpin"
                        color="#00BFFF"
                        height="100"	
                        width="100"
                    /> 
                    </Col>
            </Row>

            <Row>
                <Col sm="12" md={{ size: 8, offset: 2 }}>


                
            
                </Col>
            </Row>

            </div>



            
              
        } else {

            data = <div>
            

            <Row>
                <Col sm="12" md={{ size: 8, offset: 2 }}>

                    <Col sm="3">
                    <Form
                        onSubmit={this.handleAdd}
                    >
                        <FormGroup>
                            <Label for="exampleFile">File Upload</Label>
                            <Input type="file" name="file" id="exampleFile" onChange={this.handlePhoto} />
                            <Label htmlFor="category">Category</Label>
                                <Input
                                    type="select"
                                    name="category"
                                    id="category"
                                    placeholder="Category"
                                    required
                                    onChange={this.handleName}
                                >
                                    <option value="Kitchens">Kitchens</option>
                                    <option value="Refacing">Refacing</option>
                                    <option value="Cabinets">Cabinets</option>
                                    <option value="Bathrooms">Bathrooms</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Happy_Customers">Happy Customers</option>
                        
                                </Input>
                            <FormText color="muted">
                                To Add Photos, Please Choose Your File, Then Press "Add"<br />
                                To Delete, Please Select Your Photos with the Checkbox, Then Press Delete<br />
                            </FormText>
                            <Button color="primary">Add</Button>
                            <Button color="danger" onClick={this.remove} >Delete</Button>
                        </FormGroup>
                    </Form>
                    </Col>
                
            
                </Col>
            </Row>

            <Row>
                    <Col sm="12" md={{ size: 8, offset: 2 }}>
                        
                            <Gallery images={this.state.images}
                            onSelectImage={this.onSelectImage}
                            />
                    </Col>
            </Row>

            <Row>
                <Col sm="12" md={{ size: 8, offset: 2 }}>


                
            
                </Col>
            </Row>
        </div>


        }

        return(
            <div>
                {data}
            </div>
         

            
        )
    }
}





export default Photos;
