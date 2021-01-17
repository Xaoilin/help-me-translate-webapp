import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {withRouter} from "react-router-dom";
import {LOCALHOST} from "../../js/constants/url_constants";
import '../../css/translation/markup.css';
import Table from "react-bootstrap/Table";
import axios from 'axios';
import AuthService from "../../services/auth_service";
import "../../css/saved/saved_data.scss";

class SavedData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            response: {
                email: "",
                savedTranslations: [{
                    id: undefined,
                    sourceLanguage: undefined,
                    targetLanguage: undefined,
                    sourceText: undefined,
                    targetText: undefined
                }]
            }
        };
    }

    getUserData() {
        if (!this.state.isLoaded) {
            axios.get(`http://${LOCALHOST}:8080/api/v1/data/translations/${this.props.currentUser.id}`, {
                headers: {'Authorization': `Bearer ${this.props.currentUser.accessToken}`},
                contentType: 'application/json',
                accept: 'application/json'
            })
                .then(data => {
                    this.setState({
                        isLoaded: true,
                        response: data.data
                    });
                    console.log('data' + JSON.stringify(data.data));
                })
                .catch(error => {
                    if (error.toString().includes('401')) {
                        window.location.reload();
                        AuthService.logout();
                    }
                });
        }
    }

    render() {
        return (
            <>
                {
                    this.props.currentUser !== undefined
                    && this.getUserData()
                }
                <Container>
                    <Row>
                        <Col>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th scope="row">#</th>
                                    <th>Source</th>
                                    <th>Target</th>
                                    <th>Text</th>
                                    <th>Translation</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.isLoaded
                                    && this.state.response.savedTranslations.map((value, index) => {
                                        return (
                                                <tr>
                                                    <td><a href={`/markup-translation?id=` + value.id}>{value.id}</a></td>
                                                    <td><a href={`/markup-translation?id=` + value.id}>{value.sourceLanguage}</a></td>
                                                    <td><a href={`/markup-translation?id=` + value.id}>{value.targetLanguage}</a></td>
                                                    <td><a href={`/markup-translation?id=` + value.id}>{value.sourceText}</a></td>
                                                    <td><a href={`/markup-translation?id=` + value.id}>{value.targetText}</a></td>
                                                </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default withRouter(SavedData);