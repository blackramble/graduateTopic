import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Navbar from '../navbar/navbar';
import Login from '../login/login';
import Home from '../home/home';

const Main = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [loginUser, setLoginUser] = useState(null);

    const handleLogin = (bool) => {
        setIsLogin(bool);
    }

    const handleSetLoginUser = (info) => {
        setLoginUser(info);
    }


    return (
        <div className="main bg-lightgray">
            <div className="content">
                <BrowserRouter>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/admin" />
                    </Route>

                    <Route exact path="/admin">
                        {
                            // 測試版本
                            // <React.Fragment>
                            //     <Navbar isLogin={isLogin} handleLogin={handleLogin} />
                            //     <Home loginUser={loginUser} handleLogin={handleLogin} />
                            // </React.Fragment>
                            
                            // 正式版本
                            (isLogin)
                            ? (
                                <React.Fragment>
                                    <Navbar isLogin={isLogin} loginUser={loginUser} handleLogin={handleLogin} />
                                    <Home handleLogin={handleLogin} />
                                </React.Fragment>
                            )
                            : <Redirect to="/login" />
                        }
                    </Route>

                    <Route exact path="/login">
                        {
                            (!isLogin)
                            ? <Login handleLogin={handleLogin} handleSetLoginUser={handleSetLoginUser} />
                            : <Redirect to="/" />
                        }
                    </Route>

                </Switch>
                </BrowserRouter>
            </div>
        </div>
    )
};

export default Main;