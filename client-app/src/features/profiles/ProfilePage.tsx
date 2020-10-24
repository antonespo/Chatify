import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { RootStoreContext } from "../../app/stores/rootStore";
import { RouteComponentProps } from "react-router-dom";
import { LoadingComponent } from "../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import ProfilePlaceholder from './ProfilePlaceholder';

interface RouteParams {
  username: string;
}

const ProfilePage: React.FC<RouteComponentProps<RouteParams>> = ({
  match,
  history,
}) => {
  const RootStore = useContext(RootStoreContext);
  const {
    loadProfile,
    profile,
    loadingProfile,
    follow,
    unfollow,
    isCurrentUser,
    followingProfile,
    setActiveTab,
  } = RootStore.ProfileStore;
  const { username } = match.params;

  useEffect(() => {
    const nestedFunc = async () => {
      await loadProfile(username);
    };
    nestedFunc();
  }, [loadProfile, username]);

  if (loadingProfile || !profile || profile.username !== username)
    // return <LoadingComponent content="Loading profile..." />;
    return <ProfilePlaceholder/>;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader
          profile={profile!}
          isCurrentUser={isCurrentUser}
          followingProfile={followingProfile}
          follow={follow}
          unfollow={unfollow}
        />
        <ProfileContent setActiveTab={setActiveTab} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
