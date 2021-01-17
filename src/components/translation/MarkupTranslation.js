import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import HmtEditor from "../markup/HmtEditor";
import Button from "react-bootstrap/Button";
import Http from "../../js/http/http";
import {API_URL, LOCALHOST} from "../../js/constants/url_constants";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import {SUPPORTED_LANGUAGES} from "../../js/domain/supported_languages";
import '../../css/translation/markup.css';
import axios from "axios";
import AuthService from "../../services/auth_service";
import {withRouter} from "react-router-dom";

class MarkupTranslation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            translatedText: "",
            sourceLanguageSelected: "English",
            targetLanguageSelected: "Arabic",
            sourceText: "",
            savedResponse: {
                id: null,
                sourceLanguage: null,
                targetLanguage: null,
                sourceText: null,
                targetText: null
            }
        };
    }

    handleSourceText = (text) => {
        this.setState({sourceText: text});
        console.log("sourceText is: " + this.state.sourceText);
    }

    handleTargetText = (text) => {
        this.setState({translatedText: text});
        console.log("translatedText is: " + this.state.translatedText);
    }

    render() {
        const handleSubmit = () => {
            let targetLanguageCode = SUPPORTED_LANGUAGES.get(this.state.targetLanguageSelected);
            let sourceLanguageCode = SUPPORTED_LANGUAGES.get(this.state.sourceLanguageSelected);

            Http.postData(`http://${API_URL}:8080/api/v1/translate/json/${sourceLanguageCode}/${targetLanguageCode}`, {text: this.state.sourceText})
                .then(data => {
                    this.setState({
                        isLoaded: true,
                        translatedText: data.translatedText
                    });
                    console.log(data); // JSON data parsed by `data.json()` call
                });

        };

        const handleSourceDropDown = (eventKey, event) => {
            console.log(eventKey);
            if (eventKey === 'ar') {
                this.setState({sourceLanguageSelected: "Arabic"});
            } else if (eventKey === 'en') {
                this.setState({sourceLanguageSelected: "English"});
            }
        }

        const handleTargetDropDown = (eventKey, event) => {
            console.log(eventKey);

            if (eventKey === 'ar') {
                this.setState({targetLanguageSelected: "Arabic"});
            } else if (eventKey === 'en') {
                this.setState({targetLanguageSelected: "English"});
            }
        }

        const handleSwitch = () => {
            // console.log("switched");
            let temp = this.state.sourceLanguageSelected;
            this.setState({sourceLanguageSelected: this.state.targetLanguageSelected});
            this.setState({targetLanguageSelected: temp});
        }

        const loadSavedData = () => {
            const query = new URLSearchParams(this.props.location.search);
            const id = query.get('id');

            if (id !== null && !this.state.isLoaded) {
                console.log("loading saved data");
                axios.get(`http://${LOCALHOST}:8080/api/v1/data/translations/${this.props.currentUser.id}/${id}`, {
                    headers: {'Authorization': `Bearer ${this.props.currentUser.accessToken}`}
                })
                    .then(data => {
                        this.setState({
                            isLoaded: true,
                            savedResponse: data.data
                        });
                        console.log('data' + JSON.stringify(data.data));

                        this.setState({
                            sourceLanguageSelected: this.state.savedResponse.sourceLanguage,
                            targetLanguageSelected: this.state.savedResponse.targetLanguage,
                            sourceText: this.state.savedResponse.sourceText,
                            translatedText: this.state.savedResponse.targetText
                        })
                    })
                    .catch(error => {
                        if (error.toString().includes('401')) {
                            AuthService.logout();
                            window.location.reload();
                        }
                    });
            }
        }

        return (
            <>
                {
                    this.props.currentUser !== undefined && loadSavedData()
                }
                <Container fluid id="markup-container">
                    <Row>
                        <Col>
                            <Form>
                                <InputGroup
                                    className="d-flex flex-row justify-content-around border-grey border-bottom-0">
                                    <Dropdown onSelect={handleSourceDropDown}>
                                        <DropdownButton id="transparent-button"
                                                        title={this.state.sourceLanguageSelected}>
                                            <Dropdown.ItemText>Translate From</Dropdown.ItemText>
                                            <Dropdown.Divider/>
                                            <Dropdown.Item eventKey="ar">Arabic</Dropdown.Item>
                                            <Dropdown.Item eventKey="en">English</Dropdown.Item>
                                        </DropdownButton>
                                    </Dropdown>
                                    <Button className="d-flex bg-transparent border-0"
                                            onClick={handleSwitch}>
                                        <div id="change-icon" className="m-auto"/>
                                    </Button>
                                    <Dropdown onSelect={handleTargetDropDown}>
                                        <DropdownButton id="transparent-button"
                                                        title={this.state.targetLanguageSelected}>
                                            <Dropdown.ItemText>Translate To</Dropdown.ItemText>
                                            <Dropdown.Divider/>
                                            <Dropdown.Item eventKey="ar">Arabic</Dropdown.Item>
                                            <Dropdown.Item eventKey="en">English</Dropdown.Item>
                                        </DropdownButton>
                                    </Dropdown>
                                </InputGroup>
                                <InputGroup
                                    className="d-flex flex-row justify-content-between border-grey border-0">
                                    <HmtEditor type="tinymce-source"
                                               initialValue="Initial content"
                                               value={this.state.sourceText}
                                               onChange={this.handleSourceText}/>
                                    <HmtEditor type="tinymce-target"
                                               value={this.state.translatedText}
                                               initialValue="Translated content"
                                               onChange={this.handleTargetText}/>
                                </InputGroup>
                                <InputGroup className="d-flex flex-row justify-content-center mt-3">
                                    <Button variant="outline-success" onClick={handleSubmit}>Submit For
                                        Translation</Button>
                                </InputGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default withRouter(MarkupTranslation)