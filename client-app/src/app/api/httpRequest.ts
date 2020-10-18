import axios, { AxiosResponse } from "axios";
import { IActivity } from "../models/activity";
import { history } from "./../../index";
import { toast } from "react-toastify";
import { IUserFormValues } from "../models/user";
import { IPhoto } from "../models/profile";
import { IProfile } from "./../models/profile";
import { IActivitiesEnvelope } from "./../models/activity";

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");
    if (token) config.headers.Authorization = "bearer " + token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    history.push("/not-found");
    toast.error("Network error - make sure API is running!");
  }
  if (error.response.status === 404) {
    history.push("/not-found");
  }
  if (
    error.response.status === 401 &&
    error.response.headers["www-authenticate"].includes(
      'Bearer error="invalid_token"'
    )
  ) {
    window.localStorage.removeItem("jwt");
    history.push("/");
    toast.info("Your session has expired, please login again");
  }
  if (
    error.response.status === 400 &&
    error.response.config.method === "get" &&
    error.response.data.errors.hasOwnProperty("id")
  ) {
    history.push("/not-found");
  }
  if (
    (error.response.status === 400 &&
      error.response.config.method === "post") ||
    error.response.config.method === "put"
  ) {
    toast.error("Problem submitting the form");
  }
  if (error.response.status === 500) {
    history.push("/not-found");
    toast.error("Server error - check the terminal for more info!");
  }
  throw error.response;
});

export class httpRequest {
  static baseUrl = process.env.REACT_APP_API_URL;

  static getActivities(
    queryStrings: URLSearchParams
  ): Promise<IActivitiesEnvelope> {
    let url = this.baseUrl + "/activities";
    return axios
      .get(url, { params: queryStrings })
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static getActivity(id: string): Promise<IActivity> {
    let url = this.baseUrl + "/activities/" + id;
    return axios
      .get(url)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static postActivity(activity: IActivity) {
    let url = this.baseUrl + "/activities";
    return axios
      .post(url, activity)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static putActivity(activity: IActivity) {
    let url = this.baseUrl + "/activities/" + activity.id;
    return axios
      .put(url, activity)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static deleteActivity(id: string) {
    let url = this.baseUrl + "/activities/" + id;
    return axios
      .delete(url)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static getUser() {
    let url = this.baseUrl + "/user";
    return axios
      .get(url)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static postUser(user: IUserFormValues) {
    let url = this.baseUrl + "/user/login";
    return axios
      .post(url, user)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static registerUser(user: IUserFormValues) {
    let url = this.baseUrl + "/user/register";
    return axios
      .post(url, user)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static attendActivity(id: string) {
    let url = this.baseUrl + "/activities/" + id + "/attend";
    return axios
      .post(url, {})
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static unattendActivity(id: string) {
    let url = this.baseUrl + "/activities/" + id + "/unattend";
    return axios
      .delete(url)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static likeActivity(id: string) {
    let url = this.baseUrl + "/activities/" + id + "/like";
    return axios
      .post(url, {})
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static unlikeActivity(id: string) {
    let url = this.baseUrl + "/activities/" + id + "/unlike";
    return axios
      .delete(url)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static getProfile(username: string) {
    let url = this.baseUrl + "/profiles/" + username;
    return axios
      .get(url)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static listActivities(username: string, predicate?: string) {
    let url =
      this.baseUrl +
      "/profiles/" +
      username +
      "/activities?predicate=" +
      predicate;
    return axios
      .get(url)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static putProfile(profile: IProfile) {
    let url = this.baseUrl + "/profiles";
    return axios
      .put(url, profile)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static uploadPhoto(file: Blob, description: string): Promise<IPhoto> {
    let photoData = new FormData();
    photoData.append("File", file);
    if (description) photoData.append("description", description);
    let url = this.baseUrl + "/photos";
    return axios
      .post(url, photoData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static setMainPhoto(id: string) {
    let url = this.baseUrl + "/photos/" + id + "/setMain";
    return axios
      .post(url)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static deletePhoto(id: string) {
    let url = this.baseUrl + "/photos/" + id;
    return axios
      .delete(url)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static follow(username: string) {
    let url = this.baseUrl + "/profiles/" + username + "/follow";
    return axios
      .post(url, {})
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static unfollow(username: string) {
    let url = this.baseUrl + "/profiles/" + username + "/follow";
    return axios
      .delete(url)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }

  static listFollowings(username: string, predicate: string) {
    let url =
      this.baseUrl + "/profiles/" + username + "/follow?predicate=" + predicate;
    return axios
      .get(url)
      // .then(sleep(1000))
      .then((res) => {
        return res.data;
      });
  }
}
