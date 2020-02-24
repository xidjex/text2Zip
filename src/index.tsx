import * as React from "react";
import { render } from "react-dom";
import { Text2Zip } from "./Text2Zip";

class App extends React.Component {
  public readonly state = {
    data: null,
    text: null
  };

  handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;

    // @ts-ignore
    const [file] = target.files || [];

    const fileReader = new FileReader();
    fileReader.onload = (reader => {
      return () => {
        const contents = reader.result as string;

        const text2Zip = new Text2Zip(contents);

        const blob = text2Zip.encode().blob;

        this.setState({ data: blob, text: null });
      };
    })(fileReader);

    fileReader.readAsText(file);
  }

  handleZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    // @ts-ignore
    const [file] = target.files;

    Text2Zip.decodeBlob(file).then(result => {
      this.setState({ text: result, data: null });
    });
  }

  public render() {
    return (
      <div>
        {this.state.data && (
          <a
            download="encodedFile.z"
            href={window.URL.createObjectURL(this.state.data)}
          >
            Zipped file
          </a>
        )}
        <br />
        {this.state.text && (
          <a
            download="decodedFile.txt"
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(
              String(this.state.text)
            )}`}
          >
            Unzipped file
          </a>
        )}
        <br />
        <span>text</span>
        <br />
        <input
          type="file"
          accept="text/plain"
          onChange={this.handleTextChange}
          title="text"
        />
        <br />
        <span>zip</span>
        <br />
        <input
          type="file"
          accept="application/x-compress"
          onChange={this.handleZipChange}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
