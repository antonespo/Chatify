import React from "react";
import { List, Popup, Label, Item } from "semantic-ui-react";
import { IAttendee } from "../../../app/models/activity";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { observer } from "mobx-react-lite";
import "./Style.css";

interface IProps {
  attendees: IAttendee[];
}

const ActivityListItemAttendees: React.FC<IProps> = ({ attendees }) => {
  const theme = createMuiTheme({
    overrides: {
      MuiAvatar: {
        root: {
          display: "flex",
          marginBlock: "true",
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          border: 0,
          height: 33,
          width: 33,
          fontSize: 15,
          boxShadow: "0 1px 1px 1px rgba(255, 105, 135, .1)",
          marginTop: 2,
        },
      },
    },
  });

  const attendeePeople = () => {
    var testo = "";
    switch (attendees.length) {
      case 0:
        testo = "";
        break;
      case 1:
        testo = attendees[0].displayName + " partecipa a questo evento";
        break;
      case 2:
        testo =
          attendees[0].displayName +
          " e " +
          attendees[1].displayName +
          " partecipano a questo evento";
        break;
      case 3:
        testo =
          attendees[0].displayName +
          ", " +
          attendees[1].displayName +
          " e " +
          attendees[2].displayName +
          " partecipano a questo evento";
        break;
      default:
        testo =
          attendees[0].displayName +
          ", " +
          attendees[1].displayName +
          ", " +
          attendees[2].displayName +
          " e altri " +
          (attendees.length - 3) +
          " partecipano a questo evento";
        break;
    }
    return testo;
  };

  return (
    <Item.Description className="attendeeWidget">
      <ThemeProvider theme={theme}>
        <AvatarGroup max={4}>
          {attendees.map((attendee) => (
            <Avatar
              className="AttendeeItem"
              key={attendee.username}
              alt={attendee.displayName}
              src={attendee.image || "/assets/user.png"}
            />
          ))}
        </AvatarGroup>
      </ThemeProvider>
      {attendees.length > 0 && (
        <Popup
          content={attendees.map((l) => (
            <List size="small" key={l.displayName}>
              <List.Item>
                <List.Content>{l.displayName}</List.Content>
              </List.Item>
            </List>
          ))}
          trigger={<Label basic>{attendeePeople()} </Label>}
        />
      )}
    </Item.Description>
  );
};

export default observer(ActivityListItemAttendees);
