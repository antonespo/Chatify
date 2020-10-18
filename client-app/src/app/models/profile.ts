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
  date: Date;
  description: string;
}

export interface IActivityUser {
  id: string;
  title: string;
  category: string;
  date: Date;
}
