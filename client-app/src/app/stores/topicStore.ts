import RootStore from "./rootStore";
import { observable, action, runInAction } from "mobx";
import { IMessage, IMessageDto } from "../models/message";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { toast } from "react-toastify";
import { ITopicDto } from "../models/topic";
import { ITopic } from './../models/topic';

export default class TopicStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable loadingTopics = true;

  @observable currentTopic: ITopicDto | null = null; 

  @observable topics: ITopicDto[] = [];

  @observable.ref hubConnection: HubConnection | null = null;

  @action setCurrentTopic = (topic: ITopicDto | null) => {
    this.currentTopic = topic
  };

  @action setTopic = (topic: ITopicDto) => {
    this.topics.push(topic);
  };

  @action setTopics = (topics: ITopicDto[]) => {
    this.topics = this.topics.concat(topics);
  };

  @action createHubConnection = async () => {
    this.loadingTopics = true;
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_TOPIC_URL!, {
        accessTokenFactory: () => this.rootStore.CommonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.startConnection();

    this.hubConnection.on("ReceiveTopic", (topic: ITopicDto) => {
      this.setTopic(topic);
    });

    this.hubConnection.on("ReceiveAllTopics", (topics: ITopicDto[]) => {
      this.setTopics(topics);
    });
  };

  startConnection = async () => {
    this.hubConnection
      ?.start()
      .then(() => console.log(this.hubConnection?.state))
      .then(async () => {
        await this.hubConnection!.invoke("SendAllTopics");
        runInAction(() => {
          this.loadingTopics = false;
        });
      })
      .catch((error) => {
        console.log("Error establishing connection" + error);
        setTimeout(() => this.startConnection(), 5000);
        runInAction(() => {
          this.loadingTopics = false;
        });
      });
  };

  @action stopHubConnection = () => {
    this.hubConnection!.stop().catch((error) => console.log(error));
    this.topics = []; 
  };

  @action addTopic = async (topic: ITopic) => {
    try {
      await this.hubConnection!.invoke("CreateTopic", topic);
    } catch (error) {
      console.log(error);
    }
  };
}
