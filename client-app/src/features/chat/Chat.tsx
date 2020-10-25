import React, { Fragment, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Form as FinalForm, Field } from "react-final-form";
import { observer } from "mobx-react-lite";
import { IMessage, IMessageDto } from "../../app/models/message";
// RCE CSS
import "react-chat-elements/dist/main.css";
// MessageBox component
import { MessageBox } from "react-chat-elements";
import TextInput from "./../../app/common/form/TextInput";
import { format } from "date-fns";
import { ThemeProvider, MessageList } from "@livechat/ui-kit";
import { LoadingComponent } from "../../app/layout/LoadingComponent";
import NotFound from './../../app/layout/NotFound';
import { Link } from 'react-router-dom';

const Chat = () => {
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.UserStore;
  const { currentTopic: topic } = rootStore.TopicStore;
  const {
    messages: chat,
    createHubConnection,
    stopHubConnection,
    addMessage,
    loadingChat,
  } = rootStore.ChatStore;

  useEffect(() => {
    const nestedFunc = async () => {
      await createHubConnection();
    };

    nestedFunc();
    return () => {
      stopHubConnection();
    };
  }, [createHubConnection, stopHubConnection]);

  const messageSide = (message: IMessageDto) => {
    if (message.basicAppUser.userName === user?.username) {
      return "right";
    } else {
      return "left";
    }
  };

  const newMessage = (values: any) => {
    var message: IMessage = {
      body: values.body,
      topicId: topic?.id!,
    };
    addMessage(message);
  };

  if (loadingChat) return <LoadingComponent content="Loading chat..." />;
  if (!loadingChat && !topic?.id) return <NotFound/>;
 
  return (
    <Fragment>
      <Header>{topic?.name}</Header>
      <Segment attached>
        <ThemeProvider>
          <div style={{ width: "auto", height: 500 }}>
            <MessageList active>
              {chat &&
                chat.map((message) => (
                  <MessageBox
                    key={message.id}
                    position={messageSide(message)}
                    type={"text"}
                    text={message.body}
                    title={message.basicAppUser.displayName}
                    dateString={format(new Date(message.createdAt), "k:mm")}
                  />
                ))}
            </MessageList>
          </div>
          <br />
          <FinalForm
            onSubmit={newMessage}
            render={({ handleSubmit, submitting, form }) => (
              <Form
                onSubmit={() => {
                  handleSubmit();
                  form.reset();
                }}
              >
                <Grid columns="two" divided>
                  <Grid.Row>
                    <Grid.Column width={14}>
                      <Field
                        name="body"
                        component={TextInput}
                        placeholder="Type message..."
                      />
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <Button
                        // content="Add Message"
                        // labelPosition="left"
                        icon="send"
                        primary
                        loading={submitting}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            )}
          />
        </ThemeProvider>
      </Segment>
    </Fragment>
  );
};

export default observer(Chat);
