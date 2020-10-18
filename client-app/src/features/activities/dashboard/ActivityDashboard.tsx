import React, { Fragment, useContext, useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ActivityFilters from "./ActivityFilters";
import ActivityListEmpty from "./ActivityListEmpty";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

const ActivityDashboard: React.FC = () => {
  const RootStore = useContext(RootStoreContext);
  const {
    loadActivities,
    activitiesGroup,
    setPage,
    page,
    totalPages,
    loadingInitial,
  } = RootStore.ActivityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadActivities().then(() => {
      setLoadingNext(false);
    });
  };

  useEffect(() => {
    const nestedFunc = async () => {
      await loadActivities();
    };
    nestedFunc();
  }, [loadActivities]);

  return (
    <Grid>
      <Grid.Column width={10}>
        {activitiesGroup.length === 0 && loadingInitial ? (
          <Fragment>
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
          </Fragment>
        ) : (
          <Fragment>
            {activitiesGroup.length === 0 ? (
              <ActivityListEmpty />
            ) : (
              <InfiniteScroll
                pageStart={0}
                loadMore={handleGetNext}
                hasMore={!loadingNext && page + 1 < totalPages}
                initialLoad={false}
              >
                <ActivityList />
              </InfiniteScroll>
            )}
          </Fragment>
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
