import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from "react-router-dom";
import { RootStoreContext } from "./../stores/rootStore";

interface IProps extends RouteProps {
    render: (props: RouteComponentProps<any>) => JSX.Element
}

const PrivateRoute: React.FC<IProps> = ({ render: JsxElements, ...rest }) => {
  const RootStore = useContext(RootStoreContext);
  const { isLoggedIn } = RootStore.UserStore;

  return (
    <Route
      {...rest}
      render={(props)=>  isLoggedIn ? <JsxElements {...props}/> : <Redirect to={'/'}/>}
    />
  );
};

export default observer(PrivateRoute);
