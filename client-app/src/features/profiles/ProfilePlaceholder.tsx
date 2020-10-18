import React from "react";
import { Grid, Placeholder, Segment } from "semantic-ui-react";

const ProfilePlaceholder = () => {
  return (
    <Grid>
      <Grid.Column width={16}>
        <Segment style={{ minHeight: 150 }}>
          <Placeholder>
            <Placeholder.Header></Placeholder.Header>
            <Placeholder.Header></Placeholder.Header>
            <Placeholder.Header>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Header></Placeholder.Header>
            <Placeholder.Header></Placeholder.Header>
          </Placeholder>
        </Segment>
      </Grid.Column>
      <Grid.Column width={12}>
        <Segment style={{ minHeight: 150 }}>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Header></Placeholder.Header>

            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        </Segment>
      </Grid.Column>
      <Grid.Column width={4}>
        <Segment style={{ minHeight: 150 }}>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Header>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Header>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Header>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
          </Placeholder>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default ProfilePlaceholder;
