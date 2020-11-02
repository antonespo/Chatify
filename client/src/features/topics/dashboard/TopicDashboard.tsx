import React, { useContext, useEffect } from "react";
import { Card, Grid, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ModalChat from "./ModalChat";
import ModalAddTopic from "./ModalAddTopic";

const TopicDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    topics,
    createHubConnection,
    stopHubConnection,
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

  if (loadingTopics) return <LoadingComponent content="Loading topics..." />;

  return (
    <Grid>
      <Grid.Row>
        <ModalAddTopic />
      </Grid.Row>
      <Grid.Row>
        <Segment clearing>
          <Card.Group itemsPerRow={4}>
            {topics.map((topic) => (
              <ModalChat key={topic.id} topic={topic} />
              // <TopicCard key={topic.id} topic={topic} />
            ))}
          </Card.Group>
        </Segment>
      </Grid.Row>
    </Grid>
  );
};

export default observer(TopicDashboard);
