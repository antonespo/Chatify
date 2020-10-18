import ActivityStore from "./activityStore";
import UserStore from "./userStore";
import { createContext } from "react";
import { configure } from "mobx";
import CommonStore from "./commonStore";
import ChatStore from "./chatStore";
import ProfileStore from "./profileStore";

configure({ enforceActions: "always" });

export default class RootStore {
  ActivityStore: ActivityStore;
  UserStore: UserStore;
  CommonStore: CommonStore;
  ChatStore: ChatStore;
  ProfileStore: ProfileStore;

  constructor() {
    this.ActivityStore = new ActivityStore(this);
    this.UserStore = new UserStore(this);
    this.CommonStore = new CommonStore(this);
    this.ChatStore = new ChatStore(this);
    this.ProfileStore = new ProfileStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
