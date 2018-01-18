import React, { Component } from "react";
import StackGrid from "react-stack-grid";

export default class GridTest extends Component {
  render() {
    return (
      <StackGrid
        columnWidth={250}
      >
        <div key="key1" style={{"width":"200px"}}>Item 1</div>
        <div key="key2" style={{"width":"200px"}}>Item 2</div>
        <div key="key3" style={{"width":"200px"}}>Item 3</div>
      </StackGrid>
    );
  }
}
