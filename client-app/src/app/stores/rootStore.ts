import UserStore from "./userStore";
import { createContext } from "react";
import { configure } from "mobx";
import CommonStore from "./commonStore";
import ChatStore from "./chatStore";
import ProfileStore from "./profileStore";
import TopicStore from "./topicStore";

configure({ enforceActions: "always" });

export default class RootStore {
  UserStore: UserStore;
  CommonStore: CommonStore;
  ChatStore: ChatStore;
  TopicStore: TopicStore;
  ProfileStore: ProfileStore;

  constructor() {
    this.UserStore = new UserStore(this);
    this.CommonStore = new CommonStore(this);
    this.ChatStore = new ChatStore(this);
    this.TopicStore = new TopicStore(this);
    this.ProfileStore = new ProfileStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
