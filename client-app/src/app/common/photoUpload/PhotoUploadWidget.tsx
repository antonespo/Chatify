import React, { Fragment, useState, useEffect } from "react";
import { Grid, Button, Card, Form } from "semantic-ui-react";
import { Form as FinalForm, Field } from "react-final-form";
import { observer } from "mobx-react-lite";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import TextAreaInput from "./../form/TextAreaInput";

interface IProps {
  uploadPhoto: (file: Blob, description: string) => void;
  loading: boolean;
  setModalOpen: (status: boolean) => void;
}
export const PhotoUploadWidget: React.FC<IProps> = ({
  uploadPhoto,
  loading,
  setModalOpen,
}) => {
  const [file, setFile] = useState<any[]>([]);
  const [image, setImage] = useState<Blob | null>(null);
  const [description] = useState<string>("");

  useEffect(() => {
    return () => {
      file.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  });

  const handleUpload = async (value: any) => {
    await uploadPhoto(image!, value.description);
    setModalOpen(false);
  };

  return (
    <Fragment>
      {file.length > 0 ? (
        <Fragment>
          <Grid divided="vertically">
            <Grid.Row centered>
              {file.length > 0 && (
                <PhotoWidgetCropper
                  setImage={setImage}
                  imagePreview={file[0].preview}
                />
              )}
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={3}>
                <Card centered style={{ width: "fit-content" }}>
                  <div
                    className="img-preview"
                    style={{
                      minHeight: "100px",
                      minWidth: "100px",
                      overflow: "hidden",
                      margin: "auto",
                    }}
                  />
                </Card>
              </Grid.Column>
              <Grid.Column width={13}>
                <FinalForm
                  onSubmit={handleUpload}
                  render={({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                      <Field
                        name="description"
                        placeholder="Write something about this picture..."
                        value={description}
                        component={TextAreaInput}
                        rows={2}
                      />
                      <br />
                      <Button
                        positive
                        content="Upload"
                        icon="check"
                        loading={loading}
                        floated="right"
                        type="submit"
                      />
                      <Button
                        content="Back"
                        icon="arrow left"
                        disabled={loading}
                        floated="right"
                        onClick={() => setFile([])}
                      />
                    </Form>
                  )}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Fragment>
      ) : (
        <Fragment>
          <Grid.Column width={5}>
            <PhotoWidgetDropzone setFile={setFile} />
          </Grid.Column>
          <br />
          <Button
            content="Close"
            icon="close"
            floated="right"
            onClick={() => setModalOpen(false)}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default observer(PhotoUploadWidget);
