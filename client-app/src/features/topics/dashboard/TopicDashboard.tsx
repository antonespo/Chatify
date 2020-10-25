import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  Card,
  Divider,
  Grid,
  Header,
  Icon,
  Loader,
  Segment,
} from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ProfileCard from "../../profiles/ProfileCard";
import TopicCard from "./TopicCard";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { Link } from "react-router-dom";

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
            <TopicCard key={topic.id} topic={topic} />
          ))}
          <Card centered  as={Link} to={`/chat`}>
            <Card.Description textAlign="center">
              <Icon name="plus circle" color="teal" size="massive" fitted></Icon>
            </Card.Description>
          </Card>
        </Card.Group>
      </Grid.Column>
      <Grid.Column width={4}>
        <Header content={`Filters`} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
