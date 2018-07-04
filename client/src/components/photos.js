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
import API from '../api/api'



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


    handleAdd = (e) => {

        e.preventDefault();

        const add = {
            "name": this.state.name,
            "grade": {
                "standard_grade": {
                    "thickness1": {
                        "name": "4/4",
                        "price": parseFloat(this.state.price1)
                    },
                    "thickness2": {
                        "name": "5/4",
                        "price": parseFloat(this.state.price2)
                    }
                },
                "select_grade": {
                    "thickness1": {
                        "name": "4/4",
                        "price": parseFloat(this.state.price3)
                    },
                    "thickness2": {
                        "name": "5/4",
                        "price": parseFloat(this.state.price4)
                    }
                }
            }
        }

        return (
            API
                .post(add)
                .then(res => console.log(res.data))
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

        console.log(this.state.price1)

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
                    <Col xs="12" sm="12" md="12" lg="6">
                        <Card>
                            <CardHeader>
                                Woodtype
                            </CardHeader>
                            <CardBody>
                                <Collapse
                                    isOpen={this.state.collapse}
                                >
                                    <BootstrapTable
                                        keyField="_id"
                                        data={this.state.data}
                                        columns={columns}
                                        cellEdit={cellEditFactory({ mode: 'click' })}
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
                        <ModalHeader toggle={this.toggleModal}>Add Woodtype</ModalHeader>
                        <ModalBody>


                            <Row>
                                <Col xs="12" sm="12">
                                    <Row>
                                        <Col xs="3">
                                            <FormGroup>
                                                <Label htmlFor="design">Name</Label>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    placeholder="Name"
                                                    required
                                                    onChange={this.handleName}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>

                                        <Col xs="3">
                                            <FormGroup>
                                                <Label htmlFor="price1">4/4 Standard Grade</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    name="price1"
                                                    id="price1"
                                                    placeholder="Price"
                                                    required
                                                    onChange={this.handlePrice1}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col xs="3">
                                            <FormGroup>
                                                <Label htmlFor="price2">5/4 Standard Grade</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    name="price2"
                                                    id="price2"
                                                    placeholder="Price"
                                                    required
                                                    onChange={this.handlePrice2}
                                                />
                                            </FormGroup>
                                        </Col>


                                        <Col xs="3">
                                            <FormGroup>
                                                <Label htmlFor="price3">4/4 Select Grade</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    name="price3"
                                                    id="price3"
                                                    placeholder="Price"
                                                    required
                                                    onChange={this.handlePrice3}
                                                />
                                            </FormGroup>
                                        </Col>


                                        <Col xs="3">
                                            <FormGroup>
                                                <Label htmlFor="price4">5/4 Select Grade</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    name="price4"
                                                    id="price4"
                                                    placeholder="Price"
                                                    required
                                                    onChange={this.handlePrice4}
                                                />
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
