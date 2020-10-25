import React, { useContext } from "react";
import { Card, Image, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { ITopic, ITopicDto } from "../../../app/models/topic";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { format } from "date-fns";

interface IProps {
  topic: ITopicDto;
}

const TopicCard: React.FC<IProps> = ({ topic }) => {
  const rootStore = useContext(RootStoreContext);
  const { setCurrentTopic } = rootStore.TopicStore;

  return (
    <Card as={Link} to={`/chat`} onClick={() => setCurrentTopic(topic)}>
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
  );
};

export default TopicCard;
