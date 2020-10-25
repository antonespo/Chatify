import RootStore from "./rootStore";
import { observable, action, runInAction } from "mobx";
import { IMessage, IMessageDto } from "../models/message";
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

  @observable loadingChat = true;

  @observable topic: string = "b633e8ff-f7f7-450b-dade-08d8782ed138";

  @observable messages: IMessageDto[] = [];

  @observable.ref hubConnection: HubConnection | null = null;

  @action setMessage = (message: IMessageDto) => {
    this.messages.push(message);
  };

  @action setMessages = (messages: IMessageDto[]) => {
    this.messages = this.messages.concat(messages);
  };

  @action createHubConnection = async () => {
    this.loadingChat = true;
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
        accessTokenFactory: () => this.rootStore.CommonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.startConnection();

    this.hubConnection.on("ReceiveMessage", (message: IMessageDto) => {
      this.setMessage(message);
    });

    this.hubConnection.on("ReceiveAllMessages", (messages: IMessageDto[]) => {
      this.setMessages(messages);
    });

    this.hubConnection.on("NewViewer", (message: string) => {
      toast.info(message, { position: "top-right" });
    });
  };

  startConnection = async () => {
    this.hubConnection
      ?.start()
      .then(() => console.log(this.hubConnection?.state))
      .then(async () => {
        await this.hubConnection!.invoke("SendAllMessages", this.topic);
        await this.hubConnection!.invoke("AddToGroup", this.topic);
        runInAction(() => {
          this.loadingChat = false;
        });
      })
      .catch((error) => {
        console.log("Error establishing connection" + error);
        setTimeout(() => this.startConnection(), 5000);
        runInAction(() => {
          this.loadingChat = false;
        });
      });
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke("RemoveFromGroup", this.topic)
      .then(() => {
        this.hubConnection!.stop();
        console.log(this.messages);
      })
      .catch((error) => console.log(error));
  };

  @action addMessage = async (message: IMessage) => {
    try {
      await this.hubConnection!.invoke("SendMessage", message);
    } catch (error) {
      console.log(error);
    }
  };
}
