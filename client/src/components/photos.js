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
import axios from 'axios'



function imageFormatter(cell, row){
    return(
        <img src = {cell} height="200px" width="200px" />
    )   
}


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

            collapse: false,
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

    postPhoto = (obj) => {
        axios.post("/upload", obj)
    }

    handleAdd = (e) => {

        e.preventDefault();    

        const data = new FormData();
        data.append('file', this.state.photoFile);

       const add = {
           "category": this.state.category,
       }
       
       const uploadFile = {
        "files": data, // Buffer or stream of file(s)
        "refId": this.state.refId, // User's Id.
        "ref": "photos", // Model name.
        "field": "photo" // Field name in the User model.
      }
       
    
        return (
            API
                .postCategory(add)
                .then(res => this.setState({ refId: res.data._id })
                .then(this.postPhoto(uploadFile))
                .then(this.load())
                .then(this.toggleModal())  
        )



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

        console.log("refId: " + this.state.refId)

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
                <Col xs="12" sm="12" md="12" lg="3" />
                    <Col xs="12" sm="12" md="12" lg="6">
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
                                    <Button color="secondary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>Edit</Button>
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
