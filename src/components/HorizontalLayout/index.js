import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  changeLayout,
  changeTopbarTheme,
  changeLayoutWidth,
} from "../../store/actions";

// Other Layout related Component
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";
import Rightbar from "../CommonForBoth/Rightbar";

const Layout = (props) => {

  const [isMenuOpened,SetIsMenuOpened] = useState('false')

  /**
  * Opens the menu - mobile
  */
  const openMenu = (e) => {
    SetIsMenuOpened(!isMenuOpened);
  }

  const title = props.location.pathname;
  let currentage = title.charAt(1).toUpperCase() + title.slice(2);

  document.title =
    currentage + " | Spartan - Protocol";

  props.changeLayout('horizontal');
  if (props.topbarTheme) {
    props.changeTopbarTheme(props.topbarTheme);
  }

  if (props.layoutWidth) {
    props.changeLayoutWidth(props.layoutWidth);
  }

  return (
    <React.Fragment>

      <div id="layout-wrapper">
        <Header theme={props.topbarTheme}
          isMenuOpened={isMenuOpened}
          openLeftMenuCallBack={openMenu} />
        <Navbar menuOpen={isMenuOpened} />
        <div className="main-content">
          {props.children}
        </div>
        <Footer />
      </div>

      <Rightbar />
    </React.Fragment>
  );
}

const mapStatetoProps = () => {
  return {
    ...Layout
  };
};

export default connect(mapStatetoProps, {
  changeTopbarTheme, changeLayout, changeLayoutWidth
})(withRouter(Layout));
