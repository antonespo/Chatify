import { observable, action, runInAction, computed } from "mobx";
import { IUser, IUserFormValues } from "../models/user";
import { httpRequest } from "./../api/httpRequest";
import RootStore from "./rootStore";
import { history } from "./../../index";

export default class UserStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      let user = await httpRequest.postUser(values);
      runInAction("updating observable", () => {
        this.user = user;
        this.rootStore.CommonStore.setToken(user.token);
      });
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  @action logout = () => {
    this.rootStore.CommonStore.setToken(null);
    this.user = null;
    history.push("/");
  };

  @action getUser = async () => {
    try {
      const user = await httpRequest.getUser();
      runInAction(() => {
        this.user = user;
        this.rootStore.CommonStore.setToken(user.token);
      });
    } catch (error) {
      console.log(error);
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      let user = await httpRequest.registerUser(values);
      runInAction("updating observable", () => {
        this.user = user;
        this.rootStore.CommonStore.setToken(user.token);
      });
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };
}
