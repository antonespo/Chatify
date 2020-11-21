import React, { useContext } from "react";
import { Modal, Icon, Card, Image } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import Chat from "./Chat";
import { ITopicDto } from "../../../app/models/topic";
import { format } from "date-fns";

interface IProps {
  topic: ITopicDto;
}

const ModalChat: React.FC<IProps> = ({ topic }) => {
  const rootStore = useContext(RootStoreContext);
  const { setCurrentTopic } = rootStore.TopicStore;

  return (
    <Modal
      closeIcon
      size="small"
      trigger={
        <Card
          onClick={() => {
            setCurrentTopic(topic);
          }}
        >
          <Image src={"/assets/topic.png"} />
          <Card.Content>
            <Card.Header>{topic.name}</Card.Header>
            <Card.Description>{topic.description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div>
              <Icon name="user" />
              {topic.memberDtos.length} members
            </div>
            <div>
              Created at: {format(new Date(topic.createdAt), "dd/MM/YYYY k:mm")}
            </div>
          </Card.Content>
        </Card>
      }
    >
      <Chat />
    </Modal>
  );
};

export default observer(ModalChat);
