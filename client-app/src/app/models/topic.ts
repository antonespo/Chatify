import { IBasicAppUser } from './profile';

export interface ITopic {
  name: string;
  description: string; 
}

export interface ITopicDto {
  id: string;
  name: string;
  description: string;
  createdAt: Date; 
  memberDtos: IMemberDto[];
}

export interface IMemberDto {
    topicId: string;
    basicAppUser: IBasicAppUser; 
  }
