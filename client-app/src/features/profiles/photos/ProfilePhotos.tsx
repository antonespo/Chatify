import React, { useContext } from "react";
import { Tab, Header, Card, Container, Grid } from "semantic-ui-react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import ModalPhoto from "./ModalPhoto";
import ModalPhotoUpload from "./ModalPhotoUpload";
import { observer } from "mobx-react-lite";

const ProfilePhotos = () => {
  const RootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser } = RootStore.ProfileStore;

  return (
    <Tab.Pane>
      <Container>
        <Grid>
          <Grid.Column width={16}>
            <Header floated="left" icon="image" content="Photos" />
            {isCurrentUser && <ModalPhotoUpload />}
          </Grid.Column>
          <Grid.Column width={16}>
            {profile && (
              <Card.Group itemsPerRow={4}>
                {profile?.photos.map((photo) => (
                  <ModalPhoto photo={photo} key={photo.id} />
                ))}
              </Card.Group>
            )}
            {profile && profile.photos.length === 0 && (
              <p>No photos available</p>
            )}
          </Grid.Column>
        </Grid>
      </Container>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
