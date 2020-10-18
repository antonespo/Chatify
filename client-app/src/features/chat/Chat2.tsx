import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";

import { RootStoreContext } from "../../app/stores/rootStore";
import { Form as FinalForm, Field } from "react-final-form";
import { observer } from "mobx-react-lite";
import { IMessage } from "../../app/models/message";
// RCE CSS
import "react-chat-elements/dist/main.css";
// MessageBox component
import { MessageBox, Popup, Dropdown, Icon } from "react-chat-elements";
import TextInput from "./../../app/common/form/TextInput";
import { format } from "date-fns";
import {
  ThemeProvider,
  AgentBar,
  MessageList,
  MessageMedia,
  MessageTitle,
  MessageGroup,
  MessageButtons,
  MessageButton,
} from "@livechat/ui-kit";
import {
  FixedWrapper,
  SampleMaximized,
  SampleMinimized,
  Message,
  MessageText,
  Avatar,
} from "@livechat/ui-kit";

const Chat = () => {
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.UserStore;
  const {
    messages: chat,
    createHubConnection,
    stopHubConnection,
    addMessage,
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

  const messageSide = (message: IMessage) => {
    if (message.userName === user?.username) {
      return "right";
    } else {
      return "left";
    }
  };

  const theme = {
    vars: {
      "primary-color": "#427fe1",
      "secondary-color": "#fbfbfb",
      "tertiary-color": "#fff",
      "avatar-border-color": "blue",
    },
    AgentBar: {
      Avatar: {
        size: "42px",
      },
      css: {
        backgroundColor: "var(--secondary-color)",
        borderColor: "var(--avatar-border-color)",
      },
    },
    Message: {
      css: {
        fontWeight: "bold",
      },
    },
  };

  return (
    <Segment attached>
      <ThemeProvider>
        <div style={{ maxWidth: "80%", height: 400 }}>
          <MessageList active>
            <MessageGroup
              avatar="https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg"
              onlyFirstWithMeta
            >
              <Message authorName="Jon Smith" date="21:37" showMetaOnClick>
                <MessageMedia>
                  <img src="https://static.staging.livechatinc.com/1520/P10B78E30V/dfd1830ebb68b4eefe6432d7ac2be2be/Cat-BusinessSidekick_Wallpapers.png" />
                </MessageMedia>
              </Message>
              <Message authorName="Jon Smith" date="21:37">
                <MessageTitle title="Message title" subtitle="24h" />
                <MessageMedia>
                  <img src="https://static.staging.livechatinc.com/1520/P10B78E30V/dfd1830ebb68b4eefe6432d7ac2be2be/Cat-BusinessSidekick_Wallpapers.png" />
                </MessageMedia>
                <MessageText>
                  The fastest way to help your customers - start chatting with
                  visitors
                </MessageText>
                <MessageButtons>
                  <MessageButton label="View more" primary />
                  <MessageButton label="Cancel" />
                </MessageButtons>
                <MessageText>
                  The fastest way to help your customers - start chatting with
                  visitors who need your help using a free 30-day trial.
                </MessageText>
                <MessageButtons>
                  <MessageButton label="View more" primary />
                  <MessageButton label="Cancel" />
                </MessageButtons>
              </Message>
              <Message date="21:38" authorName="Jon Smith">
                <MessageText>Hi! I would like to buy those shoes</MessageText>
              </Message>
            </MessageGroup>
            <MessageGroup onlyFirstWithMeta>
              <Message date="21:38" isOwn={true} authorName="Visitor">
                <MessageText>
                  I love them
                  sooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
                  much!
                </MessageText>
              </Message>
              <Message date="21:38" isOwn={true} authorName="Visitor">
                <MessageText>This helps me a lot</MessageText>
              </Message>
            </MessageGroup>
            <MessageGroup
              avatar="https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg"
              onlyFirstWithMeta
            >
              <Message authorName="Jon Smith" date="21:37">
                <MessageText>No problem!</MessageText>
              </Message>
              <Message
                authorName="Jon Smith"
                imageUrl="https://static.staging.livechatinc.com/1520/P10B78E30V/dfd1830ebb68b4eefe6432d7ac2be2be/Cat-BusinessSidekick_Wallpapers.png"
                date="21:39"
              >
                <MessageText>
                  The fastest way to help your customers - start chatting with
                  visitors who need your help using a free 30-day trial.
                </MessageText>
              </Message>
              <Message authorName="Jon Smith" date="21:39">
                <MessageMedia>
                  <img src="https://static.staging.livechatinc.com/1520/P10B78E30V/dfd1830ebb68b4eefe6432d7ac2be2be/Cat-BusinessSidekick_Wallpapers.png" />
                </MessageMedia>
              </Message>
            </MessageGroup>
          </MessageList>
        </div>
      </ThemeProvider>
    </Segment>
  );
};

export default observer(Chat);
