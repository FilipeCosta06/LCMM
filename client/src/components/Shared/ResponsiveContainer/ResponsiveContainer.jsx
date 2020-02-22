import PropTypes from "prop-types";
import React from "react";
import DesktopContainer from '../../Desktop/Container/DesktopContainer';
import MobileContainer from '../../Mobile/Container/MobileContainer';

const ResponsiveContainer = (props) => (
    <React.Fragment>
        <DesktopContainer
            home={props.home}
            >
            {props.children}
        </DesktopContainer>

        <MobileContainer
            home={props.home}
            >
            {props.children}
        </MobileContainer>
    </React.Fragment>
);

ResponsiveContainer.propTypes = {
    children: PropTypes.node,
};

export default ResponsiveContainer;