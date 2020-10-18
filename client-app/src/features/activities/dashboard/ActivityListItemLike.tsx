import React, { useContext } from "react";
import { List, Popup, Icon, Label, Item } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import "./Style.css";

interface IProps {
  activity: IActivity;
}

const ActivityListItemLike: React.FC<IProps> = ({ activity }) => {
  const RootStore = useContext(RootStoreContext);
  const { likeActivity, unlikeActivity } = RootStore.ActivityStore;

  const like = async () => {
    if (!activity.isLike) {
      await likeActivity(activity.id);
    } else {
      await unlikeActivity(activity.id);
    }
  };

  const likePeople = () => {
    var testo = "";
    switch (activity.likes.length) {
      case 0:
        testo = "";
        break;
      case 1:
        testo = "A " + activity.likes[0].displayName + " piace questo evento";
        break;
      case 2:
        testo =
          "A " +
          activity.likes[0].displayName +
          " e " +
          activity.likes[1].displayName +
          " piace questo evento";
        break;
      case 3:
        testo =
          "A " +
          activity.likes[0].displayName +
          ", " +
          activity.likes[1].displayName +
          " e " +
          activity.likes[2].displayName +
          " piace questo evento";
        break;
      default:
        testo =
          "A " +
          activity.likes[0].displayName +
          ", " +
          activity.likes[1].displayName +
          ", " +
          activity.likes[2].displayName +
          " e altri " +
          (activity.likes.length - 3) +
          " piace questo evento";
        break;
    }
    return testo;
  };

  return (
    <Item.Description className="likeWidget">
      <button onClick={like}>
        {activity.isLike && (
          <Icon
            link={true}
            color="red"
            size="large"
            name="heart"
            fitted={true}
          ></Icon>
        )}
        {!activity.isLike && (
          <Icon
            link={true}
            color="red"
            size="large"
            name="heart outline"
            fitted={true}
          ></Icon>
        )}
      </button>
      {activity.likes.length > 0 && (
        <Popup
          content={activity.likes.map((l) => (
            <List size="small" key={l.displayName}>
              <List.Item>
                <List.Content>{l.displayName}</List.Content>
              </List.Item>
            </List>
          ))}
          trigger={<Label basic>{likePeople()} </Label>}
        />
      )}
    </Item.Description>
  );
};

export default observer(ActivityListItemLike);
