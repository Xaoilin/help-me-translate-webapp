import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {withRouter} from "react-router-dom";
import React from "react";
import AuthService from "../../services/auth_service";

function LoginButton() {
    return (
        <Nav.Link href="/login">Login</Nav.Link>
    );
}

function RegisterButton() {
    return (
        <Nav.Link href="/register">Sign up</Nav.Link>
    );
}

class HMTNavbar extends React.Component {

    constructor(props) {
        super(props);
    }

    logOut() {
        AuthService.logout();
    }

    render() {
        return (
            <Navbar bg="light" expand="lg" className="mb-5">
                <Navbar.Brand href="/home">HelpMeTranslate</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/about">About</Nav.Link>
                        <Nav.Link href="/markup-translation">Markup Translation</Nav.Link>
                        {this.props.showAdminBoard && (
                            <Nav.Link href="/admin-board">Admin Board</Nav.Link>
                        )}

                        {this.props.currentUser && (
                            <Nav.Link href="/saved-edits">Saved Edits</Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {this.props.currentUser ? (
                            <Nav.Link href="/logout" onClick={this.logOut}>Log Out</Nav.Link>
                        ) : (
                            <>
                                {this.props.location.pathname === '/register' ? <LoginButton/> : <RegisterButton/>}
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

}

export default withRouter(HMTNavbar);