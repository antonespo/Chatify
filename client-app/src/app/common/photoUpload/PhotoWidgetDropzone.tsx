import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Icon, Header } from "semantic-ui-react";

interface IProps {
  setFile: (files: object[]) => void;
}

const dropzoneStyles = {
  border: "dashed 3px",
  borderColor: "#eee",
  borderRadius: "10px",
  paddingTop: "30px",
  textAlign: "center" as "center",
  height: "250px",
  width: "250px",
  cursor: "pointer",
  margin: "auto",
};

const dropzoneActive = {
  borderColor: "teal",
};

const PhotoWidgetDropzone: React.FC<IProps> = ({ setFile }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFile(
        acceptedFiles.map((file: object) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFile]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={
        isDragActive ? { ...dropzoneStyles, ...dropzoneActive } : dropzoneStyles
      }
    >
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header>
        To add a photo <br /> drop here <br />
        or <u>select</u>
      </Header>
    </div>
  );
};

export default PhotoWidgetDropzone;
