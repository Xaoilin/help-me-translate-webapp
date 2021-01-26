import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import {Formik} from 'formik';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AuthService from "../../services/auth_service";
import * as Yup from "yup";

export default class Register extends React.Component {

    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);

        this.state = {
            email: "",
            password: "",
            successful: false,
            message: ""
        };
    }

    handleRegister() {
        this.setState({
            message: "",
            successful: false
        });

        AuthService.register(
            this.state.email,
            this.state.password
        ).then(response => {
                this.setState({
                    message: response.data.message,
                    successful: true
                });
            },
            error => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

                this.setState({
                    successful: false,
                    message: resMessage
                });
            }
        );

    }

    render() {
        return (
            <>
                <Container>
                    <Row>
                        <Col className="col-3"></Col>
                        <Col>
                            <Card className="text-center">
                                <Card.Body>
                                    <Card.Title>Create Your Account</Card.Title>
                                    <Card.Text>
                                        <Formik
                                            initialValues={{email: '', password: '', passwordConfirmation: ''}}
                                            validationSchema={Yup.object({
                                                password: Yup.string()
                                                    .min(6, 'Must be 6 characters or more')
                                                    .max(40, 'Must be 40 characters or less')
                                                    .required('Required'),
                                                email: Yup.string()
                                                    .email('Invalid email address')
                                                    .required('Required'),
                                                passwordConfirmation: Yup.string()
                                                    .oneOf([Yup.ref('password'), null], 'Passwords must match')
                                            })}
                                            onSubmit={(values, {setSubmitting}) => {
                                                setTimeout(() => {
                                                    console.log(values)
                                                    this.setState({
                                                        email: values.email,
                                                        password: values.password
                                                    })
                                                    this.handleRegister();
                                                    setSubmitting(false);
                                                }, 400);
                                            }}
                                        >
                                            {formik => (
                                                <Form onSubmit={formik.handleSubmit}>
                                                    {!this.state.successful && (
                                                        <>
                                                            <Form.Group>
                                                                <Form.Control
                                                                    type="email"
                                                                    placeholder="Enter email"
                                                                    {...formik.getFieldProps('email')}
                                                                />
                                                            </Form.Group>
                                                            {formik.touched.email && formik.errors.email ?
                                                                <div className="alert alert-warning">{formik.errors.email}</div> : null}

                                                            <Form.Group>
                                                                <Form.Control
                                                                    type="password"
                                                                    placeholder="Password"
                                                                    {...formik.getFieldProps('password')}
                                                                />
                                                            </Form.Group>
                                                            {formik.touched.password && formik.errors.password ?
                                                                <div className="alert alert-warning">{formik.errors.password}</div> : null}

                                                            <Form.Group>
                                                                <Form.Control type="password"
                                                                              placeholder="Confirm Password"
                                                                              {...formik.getFieldProps('passwordConfirmation')}/>
                                                            </Form.Group>
                                                            {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation ?
                                                                <div className="alert alert-warning">{formik.errors.passwordConfirmation}</div> : null}
                                                            <Button variant="primary" type="submit" className="mb-3">
                                                                Create Account
                                                            </Button>
                                                        </>
                                                    )}

                                                    {this.state.message && (
                                                        <Form.Group
                                                            className={this.state.successful ? "alert alert-success" : "alert alert-danger"}>

                                                            {this.state.message}

                                                        </Form.Group>
                                                    )}

                                                </Form>
                                            )}
                                        </Formik>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="col-3"></Col>
                    </Row>
                </Container>
            </>
        );
    }
}