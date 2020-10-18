import React, { useContext } from "react";
import { Segment, Item, Header, Button, Image, Icon } from "semantic-ui-react";
import { IActivityForm } from "../../../app/models/activity";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { RootStoreContext } from "../../../app/stores/rootStore";

const activityImageStyle = {
  filter: "brightness(50%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

interface IProps {
  selectedActivity: IActivityForm;
}

const ActivityDetailedHeader: React.FC<IProps> = ({ selectedActivity }) => {
  const RootStore = useContext(RootStoreContext);
  const {
    attendActivity,
    unattendActivity,
    loadingAttendance: loading,
  } = RootStore.ActivityStore;
  const host = selectedActivity.attendees.filter((a) => a.isHost)[0];

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        <Image
          src={"/assets/categoryImages/" + selectedActivity.category + ".jpg"}
          fluid
          style={activityImageStyle}
        />
        <Segment basic style={activityImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={selectedActivity.title}
                  style={{ color: "white" }}
                />
                <p>{format(selectedActivity.date!, "eeee do MMMM")}</p>
                <p>
                  Hosted by
                  <Link to={"/profile/" + host.username}>
                    <strong> {host.displayName}</strong>
                  </Link>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {selectedActivity.isHost ? (
          <Button
            as={Link}
            to={"/manage/" + selectedActivity.id}
            color="orange"
            floated="right"
          >
            Manage Event
          </Button>
        ) : selectedActivity.isGoing ? (
          <Button loading={loading} onClick={unattendActivity}>
            Cancel attendance
          </Button>
        ) : (
          <Button loading={loading} color="teal" onClick={attendActivity}>
            <Icon name="handshake outline" /> Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHeader);
