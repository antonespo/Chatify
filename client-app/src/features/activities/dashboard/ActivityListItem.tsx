import React from "react";
import { Item, Segment, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { IActivity } from "../../../app/models/activity";
import { format } from "date-fns";
import ActivityListItemAttendees from "./ActivityListItemAttendees";
import ActivityListItemLike from "./ActivityListItemLike";

interface IProps {
  activity: IActivity;
}

export const ActivityListItem: React.FC<IProps> = ({ activity }) => {
  const host = activity.attendees.filter((x) => x.isHost)[0];

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header
                as={Link}
                to={"/activities/" + activity.id}
                style={{ color: "#427fe1", textDecoration: 'underline'}}
              >
                {activity.title}
              </Item.Header>
              <Item.Description>
                <Icon name="marker" />
                {activity.venue + ", " + activity.city }
                <Icon name="clock" />
                {format(activity.date, "k:mm")}
              </Item.Description>
              <Item.Extra>
                Created by
                <Link to={"/profile/" + host.username}>
                  {" "}
                  {host.displayName}
                </Link>
              </Item.Extra>
              {activity.isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="orange"
                    content="You are hosting this activity"
                  />
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="green"
                    content="You are going to this activity"
                  />
                </Item.Description>
              )}
            </Item.Content>
            <Item.Image size="tiny" src={host.image || "/assets/user.png"} />
          </Item>
        </Item.Group>
      </Segment>
      <Segment clearing>
        <ActivityListItemAttendees attendees={activity.attendees} />
      </Segment>
      <Segment clearing>
        <ActivityListItemLike activity={activity} />
      </Segment>
    </Segment.Group>
  );
};
