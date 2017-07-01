import React, { Component } from 'react';
import { Editor, EditorState, RichUtils, Modifier, convertToRaw, convertFromRaw, ContentState }  from 'draft-js';
import CONFIG from '../../../../models/m-config.js';

const styles = {
  codeArea: {
    width: "100%",
    height: "100%",
    float: "left",
    display: "inline-block",    
    background: `url(${CONFIG.backendUrl}img/lineNumber.png)`, // ES6
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "local",
    paddingLeft: 35,
    paddingTop: 10,
    "borderColor": '#ccc',
  }
};

class CodeEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return(
      <div>
        <textarea style={ styles.codeArea }></textarea>
      </div>
    );
  }
}

export default CodeEditor;
