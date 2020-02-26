import * as React from "react";
import { render } from "react-dom";

// Components
import Tree from './components/tree/Tree';

// Utils
import { Text2Zip } from "./Text2Zip";

// Styles
import './styles.css';

const App: React.FC = () => {
  const [text2Zip, setText2Zip] = React.useState<Text2Zip | null>(null);

  const encodeFile = (file: File): void => {
    setText2Zip(null);

    const fileReader = new FileReader();
    fileReader.onload = (reader => {
      return () => {
        const contents = reader.result as string;

        setText2Zip(new Text2Zip(contents).encode());
      };
    })(fileReader);

    fileReader.readAsText(file);
  };

  const decodeFile = (file: File): void => {
    setText2Zip(null);

    Text2Zip.decodeBlob(file).then(result => {
      setText2Zip(result);
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const file: File | null = target.files ? target.files[0] : null;

    if (file?.type === 'text/plain') {
      encodeFile(file);
    }

    if (file?.type === 'application/x-compress') {
      decodeFile(file);
    }
  };

    return (
      <div className="content">
        <br/>
        <label htmlFor="input">Select *.txt or *.z file</label>
        <input
          id="input"
          type="file"
          onChange={handleInputChange}
        />

        <br/>
        <label htmlFor="inputData">TXT File Data</label>
        <textarea id="inputData" value={text2Zip?.text} />

        <br/>
        <label htmlFor="outputData">Z File Data</label>
        <textarea id="outputData" value={text2Zip?.encodedString} />

        <div className="links">
          {text2Zip && (
            <a
              download="encodedFile.z"
              href={window.URL.createObjectURL(text2Zip?.blob)}
            >
              Download Encoded File *.z
            </a>
          )}
          {text2Zip && (
            <a
              download="decodedFile.txt"
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                String(text2Zip.text)
              )}`}
            >
              Download Decoded File *.txt
            </a>
          )}
        </div>

        <Tree tree={text2Zip?.tree} />
      </div>
    );
};

render(<App />, document.getElementById("root"));
