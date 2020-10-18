import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";
import { RootStoreContext } from "../../../app/stores/rootStore";

interface DetailParams {
  activityId: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
}) => {
  const RootStore = useContext(RootStoreContext);
  const { loadActivity, selectedActivity } = RootStore.ActivityStore;

  useEffect(() => {
    const nestedFunc = async () => {
      await loadActivity(match.params.activityId);
    };
    nestedFunc();
  }, [match.params.activityId, loadActivity]);

  if (selectedActivity.id !== match.params.activityId) {
    return <LoadingComponent content="Loading activity..." />;
  } else {
    return (
      <Grid>
        <Grid.Column width={10}>
          <ActivityDetailedHeader selectedActivity={selectedActivity} />
          <ActivityDetailedInfo selectedActivity={selectedActivity} />
          <ActivityDetailedChat />
        </Grid.Column>
        <Grid.Column width={6}>
          <ActivityDetailedSidebar attendees={selectedActivity.attendees}/>
        </Grid.Column>
      </Grid>
    );
  }
};

export default observer(ActivityDetails);
