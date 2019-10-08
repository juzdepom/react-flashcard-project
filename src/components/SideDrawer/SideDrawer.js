import React from 'react';
import './SideDrawer.scss';

const sideDrawer = props => {
    let drawerClass = 'side-drawer';
    if (props.show){
        drawerClass = 'side-drawer open';
    }
    return (
        <nav className={drawerClass}>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/">My Profile</a></li>
                <li><a href="/">My Progress</a></li>
                <li><a href="/">Add Cards</a></li>
            </ul>
        </nav>
    );
};

export default sideDrawer;