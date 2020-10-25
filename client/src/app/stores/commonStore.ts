import RootStore from "./rootStore";
import { observable, action, reaction } from "mobx";

export default class CommonStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    // Primo argomento di reaction è a cosa dobbiamo reagire e si passa come una funzione
    // secondo argomento è l'effetto
    reaction(
      () => this.token,
      (token) => {
        if (token) {
          window.localStorage.setItem("jwt", token);
        } else {
          window.localStorage.removeItem("jwt");
        }
      }
    );
  }

  @observable token: string | null = window.localStorage.getItem("jwt");

  @action setToken = (token: string | null) => {
    this.token = token;
  };
}
