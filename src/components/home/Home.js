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
import Image from "react-bootstrap/Image";
import Icon from "../../assets/icons/change-icon.png";

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

    async postData(url, data) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    render() {
        const {error, isLoaded, response, sourceLanguageSelected, targetLanguageSelected} = this.state;

        let languageMap = new Map();

        languageMap.set("Arabic", "ar");
        languageMap.set("English", "en");

        let rowSize = "30";

        const handleSubmit = () => {
            console.log("textToTranslate: " + this.textInput.current.value);
            let targetLanguageCode = languageMap.get(this.state.targetLanguageSelected);
            let sourceLanguageCode = languageMap.get(this.state.sourceLanguageSelected);
            console.log("targetLanguageCode: " + targetLanguageCode);
            console.log("sourceLanguageCode: " + sourceLanguageCode);

            this.postData(`http://165.22.69.146:8080/api/v1/translate/json/${sourceLanguageCode}/${targetLanguageCode}`, {text: this.textInput.current.value})
                .then(data => {
                    this.setState({
                        isLoaded: true,
                        response: data
                    });
                    console.log(data); // JSON data parsed by `data.json()` call
                    console.log("sbimtted" + this.state.response.translatedText);
                    document.getElementById("translated_text_area").innerText = this.state.response.translatedText;
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
                            <div>

                            </div>
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
                                <InputGroup>
                                    <FormControl as="textarea"
                                                 rows={rowSize}
                                                 aria-label="With textarea"
                                                 ref={this.textInput}
                                                 placeholder="Type in your text here"
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