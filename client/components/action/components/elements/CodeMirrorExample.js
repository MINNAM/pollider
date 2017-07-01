import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';

class CodeMirrorExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '// Code',
      updateCode: '',
    };

    this.updateCode = this.updateCode.bind(this);
  }

  updateCode(newCode) {
    this.setState({
      code: newCode,
    });
  }

  render() {
    let options = {
      lineNumbers: false,
    };

    return(
      <div>
        333
        <CodeMirror value={this.state.code} onChange={this.updateCode} options={options} />
        {/* <CodeMirror value={ "asdffsadsadfasfdsdf" } onChange={ this.updateCode } options={ options } /> */}
      </div>
    );
  }
}

export default CodeMirrorExample;
