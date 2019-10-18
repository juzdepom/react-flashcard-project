import React from 'react';
import './SideDrawer.scss';
import { Link } from 'react-router-dom';

const sideDrawer = props => {
    let drawerClass = 'side-drawer';
    if (props.show){
        drawerClass = 'side-drawer open';
    }
    return (
        <nav className={drawerClass}>
            <ul>
                {/* <li><Link to="/">Home</Link></li> */}
                {/* sidedrawer gets messed up when we switch with router, need to reload manually */}
                {/* <li><Link to="/timelog">Time Log</Link></li> */}
                {/* <li><Link to="/search">Search</Link></li> */}
                <li><a href="/">My Profile</a></li>
                <li><a href="/">Add Cards</a></li>
            </ul>
        </nav>
    );
};

export default sideDrawer;