import React, { useContext } from "react";
import { Button, Menu, Container, Dropdown, Image } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { NavLink, Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";

const Navbar: React.FC = () => {
  const RootStore = useContext(RootStoreContext);
  const { initializeEmptyForm } = RootStore.ActivityStore;
  const { user, logout } = RootStore.UserStore;

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header as={NavLink} exact to="/">
          <img
            src="/assets/logoAppen.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          CHATIFY
        </Menu.Item>
        <Menu.Item name="Activities" as={NavLink} to="/activities" />
        <Menu.Item name="Chat" as={NavLink} to="/chat" />
        <Menu.Item>
          <Button
            as={NavLink}
            to="/createActivity"
            onClick={initializeEmptyForm}
            positive
            content="Create Activity"
          />
        </Menu.Item>
        {user && (
          <Menu.Item position="right">
            <Image
              avatar
              spaced="right"
              src={user.image || "/assets/user.png"}
            />
            <Dropdown pointing="top left" text={user.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={"/profile/" + user.username}
                  text="My profile"
                  icon="user"
                />
                <Dropdown.Item onClick={logout} text="Logout" icon="power" />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};

export default observer(Navbar);
