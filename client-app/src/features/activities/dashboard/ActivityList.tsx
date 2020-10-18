import React, { useContext, Fragment } from "react";
import { Item, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { ActivityListItem } from "./ActivityListItem";
import { format } from "date-fns";
import { RootStoreContext } from "../../../app/stores/rootStore";

const ActivityList: React.FC = () => {
  const RootStore = useContext(RootStoreContext);
  const { activitiesGroup } = RootStore.ActivityStore;

  return (
    <Fragment>
      {activitiesGroup.map(([dateGroup, activities]) => (
        <Fragment key={dateGroup}>
          <Label size="large" color="blue">
            {format(dateGroup, "eeee do MMMM")}
          </Label>
          <Item.Group divided>
            {activities.map((activity: any) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};
export default observer(ActivityList);
