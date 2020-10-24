import React, { useContext } from "react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { Tab, Container, Grid, Header, List } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { format } from "date-fns";
import ModalProfileInfoForm from "./ModalProfileInfoForm";

const ProfileInfo = () => {
  const RootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser } = RootStore.ProfileStore;

  return (
    <Tab.Pane>
      <Container>
        <Grid>
          <Grid.Column width={16}>
            <Header
              floated="left"
              icon="user"
              content={profile?.displayName + "'s info"}
            />
            {isCurrentUser && <ModalProfileInfoForm />}
          </Grid.Column>
          <Grid.Column width={16}>
            {profile && (
              <List>
                <List.Item>
                  <List.Icon name="user" />
                  <List.Content>{profile?.displayName}</List.Content>
                </List.Item>
                {profile?.bio && (
                  <List.Item>
                    <List.Icon name="book" />
                    <List.Content> {profile.bio}</List.Content>
                  </List.Item>
                )}
                {profile?.gender && (
                  <List.Item>
                    {profile.gender === "Male" ? (
                      <List.Icon name="mars" />
                    ) : (
                      <List.Icon name="venus" />
                    )}
                    <List.Content>{profile.gender}</List.Content>
                  </List.Item>
                )}
                {profile?.dateOfBirth && (
                  <List.Item>
                    <List.Icon name="birthday cake" />
                    <List.Content>
                      {format(profile?.dateOfBirth, "do MMM yyyy")}
                    </List.Content>
                  </List.Item>
                )}
                {profile?.phone && (
                  <List.Item>
                    <List.Icon name="mobile alternate" />
                    <List.Content>{profile.phone}</List.Content>
                  </List.Item>
                )}
              </List>
            )}
          </Grid.Column>
        </Grid>
      </Container>
    </Tab.Pane>
  );
};

export default observer(ProfileInfo);
