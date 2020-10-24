import React, { useContext, useState } from "react";
import { Modal, Button, Icon } from "semantic-ui-react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import PhotoUploadWidget from "../../../app/common/photoUpload/PhotoUploadWidget";

const ModalPhotoUpload = () => {
  const RootStore = useContext(RootStoreContext);
  const { uploadPhoto, upladingPhoto } = RootStore.ProfileStore;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Modal
      trigger={
        <Button
          floated="right"
          basic
          color="teal"
          onClick={() => setModalOpen(true)}
        >
          <Icon name="camera" />
          Add photo
        </Button>
      }
      open={modalOpen}
    >
      <Modal.Header>Photo upload</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <PhotoUploadWidget
            uploadPhoto={uploadPhoto}
            loading={upladingPhoto}
            setModalOpen={setModalOpen}
          />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default observer(ModalPhotoUpload);
