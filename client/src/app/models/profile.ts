export interface IProfile {
  displayName: string;
  username: string;
  bio: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
  phone: string | null;
  image: string;
  isFollowed: boolean;
  followerCount: number;
  followingCount: number;
  photos: IPhoto[];
}

export interface IPhoto {
  id: string;
  url: string;
  isMain: boolean;
  createdAt: Date;
  description: string;
}

export interface IBasicAppUser {
  userName: string;
  displayName: string;
  image: string; 
}