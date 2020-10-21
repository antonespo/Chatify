import RootStore from "./rootStore";
import { observable, action, runInAction, computed, reaction } from "mobx";
import { IProfile, IPhoto } from "../models/profile";
import { httpRequest } from "./../api/httpRequest";
import { toast } from "react-toastify";

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 2) {
          this.loadFollowings("follower");
        } else if (activeTab === 3) {
          this.loadFollowings("following");
        } else {
          this.followings = [];
        }
      }
    );
  }

  @observable profile: IProfile | null = null;
  @observable followings: IProfile[] = [];
  @observable loadingProfile = false;
  @observable upladingPhoto = false;
  @observable settingMainPhoto = false;
  @observable deletingPhoto = false;
  @observable updatingProfile = false;
  @observable followingProfile = false;
  @observable followingsList = false;
  @observable activeTab: number = 0;

  @computed get isCurrentUser() {
    if (this.rootStore.UserStore.user && this.profile) {
      return this.rootStore.UserStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
  };

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await httpRequest.getProfile(username);
      runInAction(() => {
        if (typeof profile.dateOfBirth === "string")
          profile.dateOfBirth = new Date(profile.dateOfBirth);
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob, description: string) => {
    this.upladingPhoto = true;
    try {
      const photo = await httpRequest.uploadPhoto(file, description);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.UserStore.user) {
            this.rootStore.UserStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.upladingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem uploading the photo");
      runInAction(() => {
        this.upladingPhoto = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.deletingPhoto = true;
    try {
      await httpRequest.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile?.photos) {
          this.profile.photos = this.profile.photos.filter(
            (p) => p.id !== photo.id
          );
        }
        this.deletingPhoto = false;
      });
    } catch (error) {
      toast.error("Problem deleting the photo");
      runInAction(() => {
        this.deletingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.settingMainPhoto = true;
    try {
      await httpRequest.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.UserStore.user!.image = photo.url;
        this.profile!.photos.find((p) => p.isMain)!.isMain = false;
        this.profile!.photos.find((p) => p.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.settingMainPhoto = false;
      });
    } catch (error) {
      toast.error("Problem setting photo as main");
      runInAction(() => {
        this.settingMainPhoto = false;
      });
    }
  };

  @action updateProfile = async (profile: IProfile) => {
    // SOME BUGS FIND -------- SOLVE IT
    this.updatingProfile = true;
    try {
      var profileEdit = { ...profile };
      // delete profile.photos;
      // delete profile.image;
      // delete profile.username;
      await httpRequest.putProfile(profile);
      runInAction(() => {
        this.profile = profileEdit;
        this.rootStore.UserStore.user!.displayName = profileEdit.displayName;
        this.updatingProfile = false;
      });
    } catch (error) {
      toast.error("Problem setting photo as main");
      runInAction(() => {
        this.updatingProfile = false;
      });
    }
  };

  @action follow = async (username: string) => {
    this.followingProfile = true;
    try {
      await httpRequest.follow(username);
      runInAction(() => {
        this.profile!.isFollowed = true;
        this.profile!.followerCount++;
        this.followingProfile = false;
      });
    } catch (error) {
      toast.error("Problem following user");
      runInAction(() => {
        this.followingProfile = false;
      });
    }
  };

  @action unfollow = async (username: string) => {
    this.followingProfile = true;
    try {
      await httpRequest.unfollow(username);
      runInAction(() => {
        this.profile!.isFollowed = false;
        this.profile!.followerCount--;
        this.followingProfile = false;
      });
    } catch (error) {
      toast.error("Problem unfollowing user");
      runInAction(() => {
        this.followingProfile = false;
      });
    }
  };

  @action loadFollowings = async (predicate: string) => {
    this.followingsList = true;
    try {
      const profiles = await httpRequest.listFollowings(
        this.profile!.username,
        predicate
      );
      runInAction(() => {
        console.log(profiles);
        this.followings = profiles;
        this.followingsList = false;
      });
    } catch (error) {
      toast.error("Problem loading followings");
      runInAction(() => {
        this.followingsList = false;
      });
    }
  };
}
