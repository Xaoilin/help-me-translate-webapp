import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup"
import FormControl from "react-bootstrap/FormControl"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button";
import '../../css/home/home.css';
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Http from "../../js/http/http";
import {API_URL} from "../../js/constants/url_constants";
import {SUPPORTED_LANGUAGES} from "../../js/domain/supported_languages";

class Home extends React.Component {

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
            targetLanguageSelected: "Arabic"
        };

        this.textInput = React.createRef();
    }

    componentDidMount() {

    }

    render() {
        const {error, isLoaded, response, sourceLanguageSelected, targetLanguageSelected} = this.state;



        let rowSize = "30";
        let newLine2 = "\r\n";

        const handleSubmit = () => {
            let targetLanguageCode = SUPPORTED_LANGUAGES.get(this.state.targetLanguageSelected);
            let sourceLanguageCode = SUPPORTED_LANGUAGES.get(this.state.sourceLanguageSelected);

            Http.postData(`http://${API_URL}:8080/api/v1/translate/json/${sourceLanguageCode}/${targetLanguageCode}`, {text: this.textInput.current.value})
                .then(data => {
                    this.setState({
                        isLoaded: true,
                        response: data
                    });
                    console.log(data); // JSON data parsed by `data.json()` call

                    let translatedText = this.state.response.translatedText;

                    let split = translatedText.split(/\r?\n/);
                    let joined = "";

                    for(let i = 0; i < split.length; i++) {
                        joined += split[i] + newLine2;
                    }

                    translatedText = joined;

                    document.getElementById("translated_text_area").value = translatedText;
                    document.getElementById("translated_text_area").style.direction = this.state.response.direction;
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
                <Container className="mt-5">
                    <Row>
                        <Col>
                            <Form>
                                <InputGroup className="d-flex flex-row justify-content-around border-grey border-bottom-0">
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
                                <InputGroup>
                                    <FormControl as="textarea"
                                                 rows={rowSize}
                                                 aria-label="With textarea"
                                                 ref={this.textInput}
                                                 placeholder='Type in your text here'
                                        // onChange={() => this.handleChange()} // useful for the future
                                    />

                                    <FormControl id="translated_text_area"
                                                 as="textarea"
                                                 rows={rowSize}
                                                 aria-label="With textarea"
                                                 placeholder="Translation will appear here"
                                    />
                                </InputGroup>
                                <Button variant="outline-success" onClick={handleSubmit}>Submit For
                                    Translation</Button>
                            </Form>
                        </Col>
                        {/*<Col>*/}
                        {/*    <InputGroup>*/}
                        {/*        <FormControl id="translated_text_area"*/}
                        {/*                     as="textarea"*/}
                        {/*                     rows={rowSize}*/}
                        {/*                     aria-label="With textarea"*/}
                        {/*                     placeholder="Translation will appear here"*/}
                        {/*        />*/}

                        {/*    </InputGroup>*/}
                        {/*    <Button variant="outline-dark">Download Translation</Button>*/}
                        {/*</Col>*/}
                    </Row>
                </Container>
            </>
        );
    }
}

export default Home;