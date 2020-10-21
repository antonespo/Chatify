import React, { Fragment, useContext } from "react";
import { Menu, Header } from "semantic-ui-react";
import { Calendar } from "react-widgets";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import { category } from "../../../app/common/options/categoryOptions";

const ActivityFilters = () => {
  const RootStore = useContext(RootStoreContext);
  const {
    filters,
    setFilters,
    startDate,
    setStartDate,
    categoryFilter,
    setCategoryFilter,
  } = RootStore.ActivityStore;

  return (
    <Fragment>
      <Menu vertical size={"large"} style={{ width: "100%", marginTop: 50 }}>
        <Header icon={"filter"} attached color={"teal"} content={"Filters"} />
        <Menu.Item
          active={filters.size === 0}
          onClick={() => setFilters("all", "true")}
          color={"teal"}
          name={"all"}
          content={"All Activities"}
        />
        <Menu.Item
          active={filters.has("isGoing")}
          onClick={() => setFilters("isGoing", "true")}
          color={"teal"}
          name={"username"}
          content={"I'm Going"}
        />
        <Menu.Item
          active={filters.has("isHost")}
          onClick={() => setFilters("isHost", "true")}
          color={"teal"}
          name={"host"}
          content={"I'm hosting"}
        />
      </Menu>

      <Menu vertical size={"large"} style={{ width: "100%" }}>
        <Header
          icon={"tag"}
          attached
          color={"teal"}
          content={"Select category"}
        />
        <Menu.Item
          active={categoryFilter.size === 0}
          onClick={() => setCategoryFilter("all", "all")}
          color={"teal"}
          name={"all"}
          content={"All categories"}
        />
        {category.map((c) => (
          <Menu.Item
            key={c.key}
            active={
              categoryFilter.has("category") &&
              categoryFilter.get("category") === c.value
            }
            onClick={() => setCategoryFilter("category", c.value)}
            color={"teal"}
            name={c.key}
            content={c.text}
          />
        ))}
      </Menu>

      <Header
        icon={"calendar"}
        attached
        color={"teal"}
        content={"Select Date"}
      />
      <Calendar
        onChange={(date: Date) => setStartDate("startDate", date)}
        value={startDate.get("startDate") || new Date()}
      />
    </Fragment>
  );
};

export default observer(ActivityFilters);
