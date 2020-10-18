import React, { useContext } from "react";
import { Modal, Card, Image, Button, Feed } from "semantic-ui-react";
import { IPhoto } from "../../../app/models/profile";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import ModalPhotoConfirmation from "./ModalPhotoConfirmation";
import { format } from "date-fns";

interface IProps {
  photo: IPhoto;
}

const ModalPhoto: React.FC<IProps> = ({ photo }) => {
  const RootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    settingMainPhoto,
    setMainPhoto,
  } = RootStore.ProfileStore;

  return (
    <Modal
      key={photo.id}
      closeIcon
      trigger={
        <Card>
          <Image src={photo.url} rounded />
        </Card>
      }
      centered={false}
    >
      <Modal.Header>{profile!.displayName + " photo"}</Modal.Header>
      <Modal.Content image>
        <Image src={photo.url} />
        <Modal.Description>
          <Feed>
            <Feed.Event>
              <Feed.Label>
                <img src={profile!.image || "/assets/user.png"} />
              </Feed.Label>
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>{profile!.displayName}</Feed.User>
                  <Feed.Date>
                    {format(photo.date, "do MMMM yyyy - H:mm")}
                  </Feed.Date>
                </Feed.Summary>
              </Feed.Content>
            </Feed.Event>
          </Feed>
          {photo.description && <p>{photo.description}</p>}
        </Modal.Description>
      </Modal.Content>
      {isCurrentUser && (
        <Modal.Actions>
          <ModalPhotoConfirmation photo={photo} />
          {!photo.isMain && (
            <Button
              onClick={() => setMainPhoto(photo)}
              loading={settingMainPhoto}
              color="orange"
              content="Set as main photo"
            />
          )}
        </Modal.Actions>
      )}
    </Modal>
  );
};

export default observer(ModalPhoto);
