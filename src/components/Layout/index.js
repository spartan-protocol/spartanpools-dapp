import React, { useState, useEffect } from "react";
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
import Rightbar from "./Rightbar";

import {useCurrentWidth} from "../Common/useCurrentWidth"

const Layout = (props) => {

  const [navIsOpen,setNavIsOpen] = useState(true)

  let width = useCurrentWidth();
  console.log(width)

  useEffect (() => {
    if (width < 450) {
      setNavIsOpen(false)
    }
    else {setNavIsOpen(true)}
    // eslint-disable-next-line
  },[])

  const toggleNav = () => {
    setNavIsOpen(!navIsOpen)
  };

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
        <Header theme={props.topbarTheme} toggleNav={toggleNav} />
        {navIsOpen &&
          <Navbar toggleNav={toggleNav} setNavIsOpen={setNavIsOpen}/>
        }
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
