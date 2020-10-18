export interface IActivitiesEnvelope {
  activities: IActivity[];
  activityCount: number;
}

export interface IActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  city: string;
  venue: string;
  isGoing: boolean;
  isHost: boolean;
  isLike: boolean;
  attendees: IAttendee[];
  likes: ILike[];
  comments: IComment[];
}

export interface IActivityForm extends Partial<IActivity> {
  time?: Date;
  attendees: IAttendee[];
  likes: ILike[];
}

export class ActivityFormValues {
  id?: string = undefined;
  title: string = "";
  description: string = "";
  category: string = "";
  date?: Date = undefined;
  time?: Date = undefined;
  city: string = "";
  venue: string = "";
  attendees: IAttendee[] = [];
  likes: ILike[] = [];

  // NON USATO
  constructor(activity?: IActivityForm) {
    if (activity?.date) {
      activity.time = activity.date;
    }
    Object.assign(this, activity);
  }
}

export interface IAttendee {
  username: string;
  displayName: string;
  image: string;
  isHost: boolean;
  isFollowed?: boolean; 
}

export interface ILike {
  username: string;
  displayName: string;
  image: string;
}

export interface IComment{
  id: string; 
  createdAt: Date; 
  body:string; 
  username: string; 
  displayName: string; 
  image: string;
}