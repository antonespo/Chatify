import React, { Fragment, useContext, useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";

const ActivityDashboard: React.FC = () => {
  const RootStore = useContext(RootStoreContext);
  const [loadingNext, setLoadingNext] = useState(false);

  useEffect(() => {});

  return (
    <Grid>
      <Grid.Column width={10}>ciao</Grid.Column>
      <Grid.Column width={6}>ciao destra</Grid.Column>

    </Grid>
  );
};

export default observer(ActivityDashboard);
