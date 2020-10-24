import React, { Fragment, useContext, useEffect } from "react";
import { Container } from "semantic-ui-react";
import Navbar from "../../features/nav/Navbar";
import { observer } from "mobx-react-lite";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "../../features/home/Home";
import ScrollToTop from "./scrollToTop";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";
import { RootStoreContext } from "../stores/rootStore";
import { LoadingComponent } from "./LoadingComponent";
import Chat from "./../../features/chat/Chat";
import ProfilePage from "./../../features/profiles/ProfilePage";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  const rootStore = useContext(RootStoreContext);
  const { token } = rootStore.CommonStore;
  const { user, getUser } = rootStore.UserStore;

  useEffect(() => {
    const nestedFunc = async () => {
      await getUser();
    };

    if (token) {
      nestedFunc();
    }
  }, [getUser]);

  if (token && !user) return <LoadingComponent content="Loading app..." />;

  return (
    <Fragment>
      <ScrollToTop />
      <ToastContainer position="bottom-right" />

      <Switch>
        <Route exact path="/" component={Home} />

        <PrivateRoute
          exact
          path="/topics"
          render={() => (
            <Fragment>
              <Navbar />
              <Container style={{ marginTop: "7em" }}>
                <ActivityDashboard />
              </Container>
            </Fragment>
          )}
        />

        <PrivateRoute
          exact
          path={"/profile/:username"}
          render={(props) => (
            <Fragment>
              <Navbar />
              <Container style={{ marginTop: "7em" }}>
                <ProfilePage {...props} />
              </Container>
            </Fragment>
          )}
        />

        <PrivateRoute
          exact
          path={"/chat"}
          render={(props) => (
            <Fragment>
              <Navbar />
              <Container style={{ marginTop: "7em" }}>
                <Chat />
              </Container>
            </Fragment>
          )}
        />

        <Route
          path="/not-found"
          render={() => (
            <Fragment>
              <Navbar />
              <Container style={{ marginTop: "7em" }}>
                <NotFound />
              </Container>
            </Fragment>
          )}
        />

        <Redirect to="not-found" />
      </Switch>
    </Fragment>
  );
};

export default observer(App);
