import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import Editor from ".";
import CodeBlock from ".";
import MarkdownControls from ".";

class MdEditor extends Component {
  constructor(props) {
    super(props);

    this.handleControlsChange = this.handleControlsChange.bind(this);
    this.handleMarkdownChange = this.handleMarkdownChange.bind(this);
    this.state = {
      markdownSrc: "",
      htmlMode: "raw"
    };
  }

  handleMarkdownChange(evt) {
    this.setState({ markdownSrc: evt.target.value });
  }

  handleControlsChange(mode) {
    this.setState({ htmlMode: mode });
  }

  render() {
    return (
      <div className="demo">
        <div className="editor-pane">
          <MarkdownControls
            onChange={this.handleControlsChange}
            mode={this.state.htmlMode}
          />

          <Editor
            value={this.state.markdownSrc}
            onChange={this.handleMarkdownChange}
          />
        </div>

        <div className="result-pane">
          <ReactMarkdown
            className="result"
            source={this.state.markdownSrc}
            skipHtml={this.state.htmlMode === "skip"}
            escapeHtml={this.state.htmlMode === "escape"}
            renderers={{ code: CodeBlock }}
          />
        </div>
      </div>
    );
  }
}

export default MdEditor;
