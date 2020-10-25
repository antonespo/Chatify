import React, { useContext, useEffect } from "react";
import { Card, Grid, Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ModalChat from "./ModalChat";

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.UserStore;
  const {
    topics,
    createHubConnection,
    stopHubConnection,
    addTopic,
    loadingTopics,
  } = rootStore.TopicStore;

  useEffect(() => {
    const nestedFunc = async () => {
      await createHubConnection();
    };

    nestedFunc();
    return () => {
      stopHubConnection();
    };
  }, [createHubConnection, stopHubConnection]);

  // const newTopic = (values: any) => {
  //   var message: IMessage = {
  //     body: values.body,
  //     topicId: topic,
  //   };
  //   addMessage(message);
  // };

  if (loadingTopics) return <LoadingComponent content="Loading topics..." />;

  return (
    <Grid>
      <Grid.Column width={12}>
        <Header content={`Choose one topic`} />
        <Card.Group itemsPerRow={4}>
          {topics.map((topic) => (
            <ModalChat key={topic.id} topic={topic} />
            // <TopicCard key={topic.id} topic={topic} />
          ))}
        </Card.Group>
      </Grid.Column>
      <Grid.Column width={4}>
        <Header content={`Filters`} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
