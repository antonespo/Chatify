import React from "react";
import { Tab } from "semantic-ui-react";
import ProfilePhotos from "./photos/ProfilePhotos";
import ProfileInfo from './info/ProfileInfo';
import ProfileFollowings from './ProfileFollowings';
import ProfileActivities from "./ProfileActivities";

interface IProps {
  setActiveTab: (activeIndex: any) => void; 
}

const panes = [
  { menuItem: "Info", render: () => <ProfileInfo/> },
  { menuItem: "Photos", render: () => <ProfilePhotos /> },
  {
    menuItem: "Activities",
    render: () => <ProfileActivities />,
  },
  {
    menuItem: "Followers",
    render: () => <ProfileFollowings/>,
  },
  {
    menuItem: "Following",
    render: () => <ProfileFollowings/>,
  },
];

const ProfileContent: React.FC<IProps> = ({setActiveTab}) => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(e, data)=> setActiveTab(data.activeIndex)}
      // activeIndex={1}
    />
  );
};

export default ProfileContent;