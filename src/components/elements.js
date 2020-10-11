import React from 'react'
import { Button as AntButton } from "antd"

export const Colour = (alpha) => {
  var colour
  if (alpha) {
    colour = {
      "yellow": 'rgba(255, 206, 86, ' + alpha + ')'
    }
  } else {
    colour = {
      "black": "#0A0001",
      "dgrey": "#161616",
      "grey": "#656565",
      "lgrey": "#B3B1B1",
      "offwhite": '#ECEAEA',
      "white": "#FFF",
      "red": "#A80005",
      "yellow": "#D09800",
      "gold": '#C7692B'
    }
  }
  return colour
}

export const H1 = (props) => {
  let styles = { ...props.style || {} }
  styles.fontSize = '32px'
  // styles.fontColour = '#000000'
  styles.fontWeight = "bold"
  styles.color = Colour().red

  if (props.margin) {
    styles.margin = props.margin
  }

  return (
    <>
      <span style={styles}>{props.children}</span>
      <br />
    </>

  )
}

export const H2 = (props) => {
  let styles = { ...props.style || {} }
  styles.fontSize = "20px"
  styles.fontWeight = "bold"
  styles.color = Colour().grey
  styles.margin = "20px 0px"

  if (props.margin) {
    styles.margin = props.margin
  }
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Subtitle = (props) => {
  let styles = { ...props.style || {} }
  styles.fontSize = "14px"
  styles.fontWeight = "bold"
  styles.color = Colour().dgrey
  styles.margin = "20px 0px"

  if (props.margin) {
    styles.margin = props.margin
  }
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}


export const Label = (props) => {
  let styles = { ...props.style || {} }
  styles.fontSize = "16px"
  styles.fontWeight = "bold"
  styles.color = Colour().dgrey
  styles.margin = "20px 0px"

  if (props.margin) {
    styles.margin = props.margin
  }
  if (props.size) {
    styles.fontSize = props.size
  }

  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const LabelGrey = (props) => {
  let styles = { ...props.style || {} }
  styles.fontSize = "16px"
  styles.fontWeight = "bold"
  styles.color = Colour().lgrey
  styles.margin = "20px 0px"

  if (props.margin) {
    styles.margin = props.margin
  }
  if (props.size) {
    styles.fontSize = props.size
  }

  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Sublabel = (props) => {
  let styles = { ...props.style || {} }
  styles.fontSize = "10px"
  styles.fontWeight = ""
  styles.color = Colour().dgrey
  styles.margin = "20px 0px"

  if (props.margin) {
    styles.margin = props.margin
  }
  if (props.size) {
    styles.fontSize = props.size
  }

  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const LabelGroup = (props) => {

  return (
    <div style={{ display: 'block' }}>
      <Label size={props.size/(1.5)}>{props.label}</Label><br />
      <Label size={props.size}>{props.element}</Label><br />
    </div>
  )
}

export const Text = (props) => {
  let styles = { ...props.style || {} }
  styles.fontSize = "14px"
  styles.color = Colour().black
  styles.margin = "20px 0px"

  if (props.bold) {
    styles.fontWeight = "bold"
  }
  if (props.color) {
    styles.color = props.color
  }
  if (props.size) {
    styles.fontSize = props.size
  }
  if (props.margin) {
    styles.margin = props.margin
  }
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const P = (props) => {
  let styles = { ...props.style || {} }
  styles.fontSize = "10px"
  styles.color = Colour().black
  styles.display = "block"
  styles.fontWeight = "bold"

  if (props.size) {
    styles.fontSize = props.size
  }
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Center = (props) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    {props.children}
  </div>
)

export const Gap = () => (
  <div>
    <br></br><br></br>
  </div>
)

export const HR = () => (
  <div>
    <hr style={{border: `1px solid ${Colour().offwhite}`,marginLeft:'-10px', marginRight:'-10px'}}/>
  </div>
)

export const Button = (props) => {
  let styles = {...props.style || {}}
  // styles.fontSize = "16px"
  // styles.fontWeight = "bold"

  // styles.textDecoration = "underline"
  // styles.marginTop = 30
  // styles.marginBottom = 30
  styles.margin = 10

  styles.display= "inline-block"
  // styles.borderBottom = "1px solid #C7692B"
  // styles.height = "30px"
  // styles.padding = "0px 0px"

  if(props.type==="secondary"){
    styles.color = Colour().gold
    styles.backgroundColor = Colour().white
    styles.borderColor = Colour().gold
  } else if (props.type==="text") {
    styles.color = Colour().gold
    styles.backgroundColor = Colour().white
    styles.borderColor = Colour().white
    styles.fontSize = 20
    styles.fontWeight = 800
  } else {
    styles.color = Colour().white
    styles.backgroundColor = Colour().gold
    styles.borderColor = Colour().gold
  }

  if (props.size) {
    styles.fontSize = props.size
  }
  if (props.backgroundColor) {
    styles.backgroundColor = props.backgroundColor
    styles.borderColor = props.backgroundColor
  }

  return (
    <AntButton
      disabled={props.disabled}
      style={styles}
      onClick={props.onClick}
      onChange={props.onChange}
      type={props.type}
      loading={props.loading}
      danger={props.danger}
      icon={props.icon}
      block={props.block}
    >
      {props.children}
    </AntButton>
  )
}

