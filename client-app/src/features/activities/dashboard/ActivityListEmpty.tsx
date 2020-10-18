import React from "react";
import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

const ActivityListEmpty = () => {
  return (
    <Segment placeholder style={{ width: "100%", marginTop: 50 }}>
      <Header icon>
        <Icon name="search" />
        There are no activities - Try to remove some filters
      </Header>
      <Segment.Inline>
        <Button as={Link} to="/activities" primary>
          Remove all filters
        </Button>
      </Segment.Inline>
    </Segment>
  );
};

export default ActivityListEmpty;
