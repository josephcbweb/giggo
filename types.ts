export interface UserInfo {
    name: string;
    email: string;
    image?: string;
  }
  
  export interface Job {
    _id: string;
    title: string;
    description: string;
    pay: string;
    location: string;
    duration: string;
    category: string;
    imageLink: string;
    user: UserInfo;
    applicants: UserInfo[];
  }
  