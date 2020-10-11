import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import About from "./components/about/About";
import Home from "./components/home/Home";
import HMTNavbar from "./components/navbar/Navbar";
import MarkupTranslation from "./components/translation/MarkupTranslation";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import AuthService from "./services/auth_service";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModeratorBoard: false,
            showAdminBoard: false,
            currentUser: undefined
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: AuthService.getCurrentUser(),
                // showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
                // showAdminBoard: user.roles.includes("ROLE_ADMIN")
            });
        }
    }

    render() {
        // const {currentUser, showModeratorBoard, showAdminBoard} = this.state;
        const {currentUser} = this.state;

        return (
            <Router>

                <HMTNavbar currentUser={currentUser} />
                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route exact path="/about" component={About}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/login" component={Login}/>
                    <Route path="/markup-translation" component={MarkupTranslation}/>
                    <Route exact path={["/", "/home"]} component={Home}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
