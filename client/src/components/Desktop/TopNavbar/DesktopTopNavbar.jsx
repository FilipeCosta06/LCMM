import {Button, Container, Icon, Input, Menu} from "semantic-ui-react";
import React from "react";
import {Link, useRouteMatch} from "react-router-dom";

const DesktopTopNavbar = function (props) {
    let match = useRouteMatch("/");

    console.log("match", match);

    return (
        <Menu
            inverted={props.inverted}
            size='large'
            style={{
                borderRadius: 0
            }}>
            <Container>
                {/* todo useHistory ou useLocation pour définir "active" dynamiquement et tej la propriété*/}
                <Menu.Item
                    as={Link}
                    active={match.isExact}
                    to='/'>
                    <Icon name='home' className="floated left"/>
                    Home
                </Menu.Item>

                <Menu.Item>
                    <Input icon='search' placeholder='Search...' />
                </Menu.Item>

                <Menu.Item position='right'>
                    <Button
                        as={Link}
                        color='orange'
                        to="/login">
                        Log in
                    </Button>
                    <Button
                        as={Link}
                        color='orange'
                        style={{ marginLeft: '0.5em' }}
                        to="/register">
                        Register
                    </Button>
                </Menu.Item>
            </Container>
        </Menu>
    )
};

export default DesktopTopNavbar;