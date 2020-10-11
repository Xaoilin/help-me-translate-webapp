import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AuthService from "../../services/auth_service";
import * as Yup from "yup";
import {Formik} from 'formik';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);

        this.state = {
            email: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    handleLogin() {
        this.setState({
            message: "",
            loading: true
        });

        AuthService.login(this.state.email, this.state.password)
            .then(() => {
                    this.props.history.push("/saved-edits");
                    window.location.reload();
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
                                    <Card.Title>Login To Your Account</Card.Title>
                                    <Card.Text>
                                        <Formik
                                            initialValues={{email: '', password: ''}}
                                            validationSchema={Yup.object({
                                                password: Yup.string()
                                                    .min(6, 'Must be 6 characters or more')
                                                    .max(40, 'Must be 40 characters or less')
                                                    .required('Required'),
                                                email: Yup.string()
                                                    .email('Invalid email address')
                                                    .required('Required')
                                            })}
                                            onSubmit={(values, {setSubmitting}) => {
                                                setTimeout(() => {
                                                    console.log(values)
                                                    this.setState({
                                                        email: values.email,
                                                        password: values.password
                                                    })
                                                    this.handleLogin();
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

                                                            <Button variant="primary" type="submit" className="mb-3">
                                                                Login
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