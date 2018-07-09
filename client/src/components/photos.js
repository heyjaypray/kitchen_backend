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



function imageFormatter(cell, row){
    return(
        <img src = {cell} height="200px" width="200px" />
    )   
}

setInterval(function() {
    axios.get("http://kitchenrestore.herokuapp.com");
}, 300000);


const columns = [
    {
        dataField: 'category',
        text: 'category'
    },
    {
        dataField:'photo.url',
        text: 'photo',
        formatter: imageFormatter
    }

];

class Photos extends Component {
    constructor(props) {
        super(props);

        // this.toggle1 = this.toggle.bind(this);
        this.state = {

            collapse: true,
            edit: false,

            data: [],
            selected: [],
            photos: [],
            category:[],
            pictures:[],
            imageURL: [],
            refId:[],

            initialData:{},
            modifiedData:{},

            modal: false,
            removeModal: false

        };
    
    }


     // every 5 minutes (300000)


    load = () => {
        return API
            .get()
            .then(res => {
                console.log("response: ")
                console.log(res)
                this.setState({ data: res.data });
            })
    };


    componentDidMount() {
        const promises = [
            this.load(),
            this.setState({ category: "Kitchen" })
        ];

        Promise.all(promises)
    }






    toggle = () => {
        this.setState({ collapse: !this.state.collapse });
        this.setState({ edit: !this.state.collapse })

        if (this.state.edit) {
            const design = this.state.selected.map((i) => {
                API
                    .update(i, i._id)
                    .then(res => console.log(res.data))
                    .then(this.setState({ selected: [] }))
            })

        }
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    toggleRemove = () => {
        this.setState({
            removeModal: !this.state.removeModal
        });
    }



    handleName = (e) => {
        this.setState({ category: e.target.value })
    }

    handlePhoto = (e) => {
        this.setState({photoFile: e.target.files[0]})
    }

    postPhoto = () => {
        axios.get("/photos")
    }

    handleAdd = async (e) => {

        e.preventDefault();    

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

        await this.load()
        await this.toggleModal();


      } catch (errorHandle) {
        console.error(errorHandle);
      }

    }


    //Design Row Select
    handleSelect = (row, isSelect) => {
        if (isSelect) {
            this.setState(() => ({
                selected: [...this.state.selected, row]
            }));
        } else {
            this.setState(() => ({
                selected: this.state.selected.filter(x => x !== row)
            }));
        }
    }

    handleDelete = (row, isSelect) => {

        if (isSelect) {

            this.setState(() => ({
                selected: [...this.state.selected, row._id]
            }));
        } else {
            this.setState(() => ({
                selected: this.state.selected.filter(x => x !== row._id)
            }));
        }

    }

    remove = () => {
        this.setState({ removeModal: !this.state.removeModal });

        const map = this.state.selected.map((i) => {
            API
                .delete(i, i._id)
                .then(res => console.log(res.data))
                .then(this.setState({ selected: [] }))
                .then(this.load())
        })
    }


    render() {

        console.log("data: " + this.state.data)


        const selectRow = {
            mode: 'checkbox',
            clickToSelect: true,
            clickToEdit: true,
            selected: this.state.selected,
            onSelect: this.handleSelect,
            hideSelectColumn: true
        };

        const deleteRow = {
            mode: 'checkbox',
            clickToSelect: true,
            selected: this.state.selected,
            onSelect: this.handleDelete,
        };

        const cellEdit = {
            mode: 'click'
        };

        return (

            <div className="animated fadeIn">



                <Row>
                <Col xs="12" sm="12" md="12" lg="2" />
                    <Col xs="12" sm="12" md="12" lg="8">
                        <Card>
                            <CardHeader>
                                Photos
                            </CardHeader>
                            <CardBody>
                                <Collapse
                                    isOpen={this.state.collapse}
                                >
                                    <BootstrapTable
                                        keyField="_id"
                                        data={this.state.data}
                                        columns={columns}
                                        // cellEdit={cellEditFactory({ mode: 'click' })}
                                        selectRow={selectRow}
                                    />

                                    <Button color="secondary" onClick={this.toggleModal} style={{ marginBottom: '1rem', marginRight: '0.5rem' }}>Add</Button>
                                    <Button color="secondary" onClick={this.toggleRemove} style={{ marginBottom: '1rem' }}>Remove</Button>

                                </Collapse>
                                <CardFooter>
                               
                                </CardFooter>
                            </CardBody>

                        </Card>
                    </Col>
                </Row>


                <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-lg">
                    <Form
                        onSubmit={this.handleAdd}
                    >
                        <ModalHeader toggle={this.toggleModal}>Add Photos</ModalHeader>
                        <ModalBody>


                            <Row>
                            
                                <Col xs="12" sm="12">
                                    <Row>
                                        <Col xs="3">
                                            <FormGroup>
                                                <Label htmlFor="category">Category</Label>
                                                <Input
                                                    type="select"
                                                    name="category"
                                                    id="category"
                                                    placeholder="Category"
                                                    required
                                                    onChange={this.handleName}
                                                >
                                                    <option>Kitchens</option>
                                                    <option>Bathrooms</option>
                                                    <option>Furniture</option>
                                                    <option>Happy Customers</option>
                                        
                                                </Input>
                                                  
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>

                                        <Col xs="3">
                                            <FormGroup>
                                                <Label htmlFor="photo">Photo</Label>
                                                <Input type="file" name="file" id="file" onChange={this.handlePhoto} />
                                            </FormGroup>
                                        </Col>

                                        

                                    </Row>
                                </Col>
                            </Row>

                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" >Submit</Button>
                            <Button color="secondary" onClick={this.toggleModal}>Close</Button>
                        </ModalFooter>
                    </Form>
                </Modal>

                <Modal isOpen={this.state.removeModal} toggle={this.toggleRemove} className="modal-lg">

                    <ModalHeader toggle={this.toggleRemove}>Remove Woodtype</ModalHeader>
                    <ModalBody>

                        <BootstrapTable
                            keyField="_id"
                            data={this.state.data}
                            columns={columns}
                            selectRow={deleteRow}
                        />
                        <Button color="secondary" onClick={this.remove} style={{ marginBottom: '1rem' }}>Submit Changes</Button>

                    </ModalBody>


                </Modal>
            </div >
        );
    }
}

export default Photos;
