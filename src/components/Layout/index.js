import React, { useState } from "react";
import { withRouter } from "react-router-dom";

// Other Layout related Component
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar"
import Header from "./Header";
import Footer from "./Footer";
import Rightbar from "./Rightbar";

const Layout = (props) => {

  const [navIsOpen,setNavIsOpen] = useState(false)

  const toggleNav = () => {
    setNavIsOpen(!navIsOpen)
  }

  const title = props.location.pathname;
  let currentage = title.charAt(1).toUpperCase() + title.slice(2);

  document.title =
    "Spartan Protocol | " + currentage;

  return (
    <React.Fragment>

      <div id="layout-wrapper">
        <Header
          theme={props.topbarTheme}
          toggleNav={toggleNav} 
          changeStates={props.changeStates}
          changeNotification={props.changeNotification}
          connectedTokens={props.connectedTokens}
          connectingTokens={props.connectingTokens}
        />
        {navIsOpen &&
          <MobileNavbar setNavIsOpen={setNavIsOpen} />
        }
        <Navbar />
        <div className="main-content">
          {props.children}
        </div>
        <Footer />
      </div>

      <Rightbar/>
    </React.Fragment>
  );
}

export default withRouter(Layout);
