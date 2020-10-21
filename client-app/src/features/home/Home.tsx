import React, { useContext, Fragment } from "react";
import { Container, Segment, Header, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { RootStoreContext } from "./../../app/stores/rootStore";
import LoginForm from "../user/LoginForm";
import RegisterForm from "../user/RegisterForm";

export const Home = () => {
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.UserStore;
  const token = window.localStorage.getItem("jwt");

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logoAppen.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          CHATIFY
        </Header>
        {user && token ? (
          <Fragment>
            <Header
              as="h2"
              inverted
              content={"Welcome back " + user.displayName}
            />
            <br />
            <Button as={Link} to="/activities" size="huge" inverted>
              Go to chats!
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Header as="h1" inverted content="Welcome to Chatify" />
            <br />

            <LoginForm buttonName="Login" />
            <RegisterForm buttonName="Register" />
          </Fragment>
        )}
      </Container>
    </Segment>
  );
};
export default Home;
