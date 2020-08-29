import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import HmtEditor from "../markup/HmtEditor";
import Button from "react-bootstrap/Button";
import Http from "../../js/http/http";
import {LOCALHOST} from "../../js/constants/url_constants";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import {SUPPORTED_LANGUAGES} from "../../js/domain/supported_languages";
import '../../css/translation/markup.css';
export default class MarkupTranslation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            response: {
                translatedText: "",
                direction: ""
            },
            sourceLanguageSelected: "English",
            targetLanguageSelected: "Arabic",
            sourceText: ""
        };
    }

    handleSourceText = (text) => {
        this.setState({sourceText: text});
        console.log("sourceText is: " + this.state.sourceText);
    }

    render() {
        const handleSubmit = () => {
            let targetLanguageCode = SUPPORTED_LANGUAGES.get(this.state.targetLanguageSelected);
            let sourceLanguageCode = SUPPORTED_LANGUAGES.get(this.state.sourceLanguageSelected);

            Http.postData(`http://${LOCALHOST}:8080/api/v1/translate/json/${sourceLanguageCode}/${targetLanguageCode}`, {text: this.state.sourceText})
                .then(data => {
                    this.setState({
                        isLoaded: true,
                        response: data
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

        return (
            <>
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
                                               onSubmit={this.handleSourceText}/>
                                    <HmtEditor type="tinymce-target"
                                               value={this.state.response.translatedText}
                                               initialValue="Translated content"
                                               onSubmit={this.handleSourceText}/>
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