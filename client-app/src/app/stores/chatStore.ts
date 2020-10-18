import RootStore from "./rootStore";
import { observable, action } from "mobx";
import { IMessage } from "../models/message";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { toast } from "react-toastify";

export default class ChatStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable messages: IMessage[] = [];

  @observable.ref hubConnection: HubConnection | null = null;

  @action setMessage = (message: IMessage) => {
    this.messages.push(message);
  };

  @action setMessages = (messages: IMessage[]) => {
    this.messages = this.messages.concat(messages);
  };

  @action createHubConnection = async () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
        accessTokenFactory: () => this.rootStore.CommonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.startConnection();

    this.hubConnection.on("ReceiveMessage", (message: IMessage) => {
      this.setMessage(message);
    });

    this.hubConnection.on("ReceiveAllMessages", (messages: IMessage[]) => {
      this.setMessages(messages);
    });

    this.hubConnection.on("Send", (message: string) => {
      toast.info(message, { position: "top-right" });
    });
  };

  startConnection = async () => {
    this.hubConnection
      ?.start()
      .then(() => console.log(this.hubConnection?.state))
      .then(async () => {
        await this.hubConnection!.invoke("SendAllMessages");
        await this.hubConnection!.invoke("AddToGroup", "GruppoLavoro");
      })
      .catch((error) => {
        console.log("Error establishing connection" + error);
        setTimeout(() => this.startConnection(), 5000);
      });
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke("RemoveFromGroup", "GruppoLavoro")
      .then(() => {
        this.hubConnection!.stop();
        console.log(this.messages);
      })
      .catch((error) => console.log(error));
  };

  @action addMessage = async (values: any) => {
    try {
      await this.hubConnection!.invoke("SendMessage", values);
    } catch (error) {
      console.log(error);
    }
  };
}
