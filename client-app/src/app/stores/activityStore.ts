import { observable, action, runInAction, computed, reaction, toJS } from "mobx";
import { SyntheticEvent } from "react";
import { IActivity, IActivityForm, IComment } from "../models/activity";
import { httpRequest } from "../api/httpRequest";
import { ActivityFormValues } from "./../models/activity";
import { history } from "./../../index";
import RootStore from "./rootStore";
import { setActivityProps, createLike } from "../common/util/util";
import { createAttendee } from "./../common/util/util";
import { toast } from "react-toastify";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

const LIMIT = 3;

export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.filters.keys(),
      () => {
        this.filterReload();
      }
    );

    reaction(
      () => Array.from(this.categoryFilter.values()),
      () => {
        this.filterReload();
      }
    );

    reaction(
      () => Array.from(this.startDate.values()),
      () => {
        this.filterReload();
      }
    );
  }

  //#region OBSERVABLE
  @observable emptyActivity = new ActivityFormValues();
  @observable activityRegistry = new Map();
  @observable activitiesGroup: any[] = [];
  @observable selectedActivity: IActivityForm = this.emptyActivity;
  @observable loadingInitial: boolean = false;
  @observable submitting: boolean = false;
  @observable buttonId: string = "";
  @observable buttonSubmit: boolean = false;
  @observable loadingAttendance: boolean = false;
  @observable.ref hubConnection: HubConnection | null = null;
  @observable activityCount = 0;
  @observable page = 0;
  @observable filters = new Map();
  @observable categoryFilter = new Map();
  @observable startDate = new Map();
  //#endregion

  //#region FILTER ACTIVITIES
  @computed get axiosParams() {
    const queryStrings = new URLSearchParams();
    var offset = this.page ? this.page * LIMIT : 0;
    queryStrings.append("limit", String(LIMIT));
    queryStrings.append("offset", String(offset));

    this.filters.forEach((value, key) => {
      queryStrings.append(key, value);
    });

    this.categoryFilter.forEach((value, key) => {
      queryStrings.append(key, value);
    });

    this.startDate.forEach((value, key) => {
      queryStrings.append(key, value.toISOString());
    });

    return queryStrings;
  }

  @action setFilters = (key: string, value: string) => {
    this.filters.clear();
    if (key !== "all") {
      this.filters.set(key, value);
    }
  };

  @action setCategoryFilter = (key: string, value: string) => {
    this.categoryFilter.clear();
    if (key !== "all") {
      this.categoryFilter.set(key, value);
    }
  };

  @action setStartDate = (key: string, value: Date) => {
    this.startDate.clear();
    this.startDate.set(key, value);
  };

  @action filterReload = () => {
    this.page = 0;
    this.activityRegistry.clear();
    this.activitiesGroup = [];
    this.loadActivities();
  };
  //#endregion

  //#region PAGING ACTIVITIES
  @computed get totalPages() {
    return Math.ceil(this.activityCount / LIMIT);
  }

  @action setPage = (page: number) => {
    this.page = page;
  };
  //#endregion

  // #region FEED ACTIVITIES
  @action loadActivities = async () => {
    try {
      this.loadingInitial = true;
      const activitiesEnvelope = await httpRequest.getActivities(
        this.axiosParams
      );
      const { activities, activityCount } = activitiesEnvelope;
      runInAction("loading activities", () => {
        activities.forEach((activity: IActivity) => {
          setActivityProps(activity, this.rootStore.UserStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.activityCount = activityCount;
        this.activitiesByDate();
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  activitiesByDate() {
    this.activitiesGroup = this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  };

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }
  // #endregion

  // #region SINGLE ACTIVITY
  @action loadActivity = async (id: string) => {
    // Check into the registry
    let activity = this.activityRegistry.get(id);
    if (activity) {
      this.selectedActivity = activity;
      return toJS(activity);
    } else if (this.selectedActivity.id === id) {
      // Check the selected activity
      return toJS(this.selectedActivity);
    } else {
      // Query the database via API
      try {
        activity = await httpRequest.getActivity(id);
        runInAction("getting activity", () => {
          setActivityProps(activity, this.rootStore.UserStore.user!);
          this.selectedActivity = activity;
        });
        return activity;
      } catch (error) {
        console.log(error);
      }
    }
  };
  //#endregion

  // #region FORM ACTIVITY: CREATE, EDIT, DELETE
  @action initializeEmptyForm = () => {
    this.selectedActivity = this.emptyActivity;
  };

  @action createActivity = async (activity: IActivity) => {
    this.buttonSubmit = true;
    try {
      await httpRequest.postActivity(activity);
      runInAction("update registry", () => {
        const attendee = createAttendee(this.rootStore.UserStore.user!);
        attendee.isHost = true;
        let attendees = [];
        attendees.push(attendee);
        activity.attendees = attendees;
        activity.isHost = true;
        activity.isGoing = true;
        activity.comments = [];
        activity.likes = [];
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.buttonSubmit = false;
      });
      history.push("/activities/" + activity.id);
    } catch (error) {
      runInAction("create activity error", () => {
        this.buttonSubmit = false;
      });
      console.log(error);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    try {
      this.buttonSubmit = true;
      await httpRequest.putActivity(activity);
      runInAction("edit activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.buttonSubmit = false;
      });
      history.push("/activities/" + activity.id);
    } catch (error) {
      runInAction("edit activity error", () => {
        this.buttonSubmit = false;
      });
      console.log(error);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    activity: IActivity
  ) => {
    this.submitting = true;
    this.buttonId = event.currentTarget.title;
    try {
      await httpRequest.deleteActivity(activity.id);
      runInAction("delete activity", () => {
        this.activityRegistry.delete(activity.id);
        this.submitting = false;
        this.buttonId = "";
      });
    } catch (error) {
      runInAction("delete activity error", () => {
        this.submitting = false;
        this.buttonId = "";
      });
      console.log(error);
    }
  };
  //#endregion

  // #region ATTEND ACTIVITY
  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.UserStore.user!);
    try {
      this.loadingAttendance = true;
      await httpRequest.attendActivity(this.selectedActivity.id!);
      runInAction(() => {
        if (this.selectedActivity) {
          this.selectedActivity.attendees.push(attendee);
          this.selectedActivity.isGoing = true;
          this.activityRegistry.set(
            this.selectedActivity.id,
            this.selectedActivity
          );
          this.loadingAttendance = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loadingAttendance = false;
      });
      toast.error("Problem signing up to activity");
    }
  };

  @action unattendActivity = async () => {
    try {
      this.loadingAttendance = true;
      await httpRequest.unattendActivity(this.selectedActivity.id!);
      runInAction(() => {
        if (this.selectedActivity) {
          this.selectedActivity.attendees = this.selectedActivity.attendees.filter(
            (a) => a.username !== this.rootStore.UserStore.user!.username
          );
          this.selectedActivity.isGoing = false;
          this.activityRegistry.set(
            this.selectedActivity.id,
            this.selectedActivity
          );
          this.loadingAttendance = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loadingAttendance = false;
      });
      toast.error("Problem cancelling attendance to activity");
    }
  };
  //#endregion

  // #region LIKE ACTIVITY
  @action likeActivity = async (id: string) => {
    const like = createLike(this.rootStore.UserStore.user!);
    try {
      runInAction(() => {
        this.selectedActivity = this.activityRegistry.get(id);
        if (this.selectedActivity) {
          this.selectedActivity.likes.push(like);
          this.selectedActivity.isLike = true;
          this.activityRegistry.set(
            this.selectedActivity.id,
            this.selectedActivity
          );
        }
      });
      await httpRequest.likeActivity(id);
    } catch (error) {
      runInAction(() => {});
      toast.error("Problem liking the activity");
    }
  };

  @action unlikeActivity = async (id: string) => {
    try {
      runInAction(() => {
        this.selectedActivity = this.activityRegistry.get(id);
        if (this.selectedActivity) {
          this.selectedActivity.likes = this.selectedActivity.likes.filter(
            (a) => a.username !== this.rootStore.UserStore.user!.username
          );
          this.selectedActivity.isLike = false;
          this.activityRegistry.set(
            this.selectedActivity.id,
            this.selectedActivity
          );
        }
      });
      await httpRequest.unlikeActivity(id);
    } catch (error) {
      runInAction(() => {});
      toast.error("Problem cancelling like to activity");
    }
  };
  //#endregion

  // #region CHAT IN THE ACTIVITY: CONNECTION AND COMMENT
  @action createHubConnection = async (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_COMMENT_URL!, {
        accessTokenFactory: () => this.rootStore.CommonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.startConnection(activityId);

    this.hubConnection.on("ReceiveComment", (comment: IComment) => {
      runInAction(() => {
        this.selectedActivity.comments?.push(comment);
      });
    });

    // this.hubConnection.on("Send", (message: string) => {
    //   toast.info(message, { position: "top-right" });
    // });
  };

  startConnection = async (activityId: string) => {
    this.hubConnection
      ?.start()
      .then(() => console.log(this.hubConnection?.state))
      .then(async () => {
        await this.hubConnection!.invoke("AddToGroup", activityId);
      })
      .catch((error) => {
        console.log("Error establishing connection" + error);
        setTimeout(() => this.startConnection(activityId), 5000);
      });
  };

  @action stopHubConnection = (activityId: string) => {
    this.hubConnection!.invoke("RemoveFromGroup", activityId)
      .then(() => {
        this.hubConnection!.stop();
      })
      .catch((error) => console.log(error));
  };

  @action addComment = async (values: any) => {
    values.activityId = this.selectedActivity?.id;
    try {
      await this.hubConnection!.invoke("SendComment", values);
    } catch (error) {
      console.log(error);
    }
  };
  //#endregion
}
