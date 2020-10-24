import React, { Fragment, useState, useContext } from "react";
import { Modal, Button } from "semantic-ui-react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { IPhoto } from "../../../app/models/profile";
import { observer } from "mobx-react-lite";

interface IProps {
  photo: IPhoto;
}

const ModalPhotoConfirmation: React.FC<IProps> = ({ photo }) => {
  const RootStore = useContext(RootStoreContext);
  const { deletePhoto, deletingPhoto } = RootStore.ProfileStore;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Modal
      size="small"
      open={modalOpen}
      trigger={
        <Button
          icon="trash"
          labelPosition="right"
          content="Delete"
          onClick={() => setModalOpen(true)}
        />
      }
    >
      {photo.isMain ? (
        <Fragment>
          <Modal.Header>Delete photo</Modal.Header>
          <Modal.Content>
            You cannot delete your main photo. Change it before deleting.
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Close"
              icon="close"
              onClick={() => setModalOpen(false)}
            />
          </Modal.Actions>
        </Fragment>
      ) : (
        <Fragment>
          <Modal.Header>Delete photo</Modal.Header>
          <Modal.Content>Are you sure to delete this photo? </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              content="Yes"
              icon="check"
              loading={deletingPhoto}
              onClick={async () => {
                await deletePhoto(photo);
                setModalOpen(false);
              }}
            />
            <Button
              negative
              content="No"
              icon="close"
              onClick={() => setModalOpen(false)}
            />
          </Modal.Actions>
        </Fragment>
      )}
    </Modal>
  );
};

export default observer(ModalPhotoConfirmation);
