import { IBasicAppUser } from './profile';

export interface IMessage {
  body: string;
  topicId: string; 
}

export interface IMessageDto {
  id: string;
  body: string;
  createdAt: Date; 
  basicAppUser: IBasicAppUser;
}
