export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'doctor' | 'nurse';
  token: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  condition: string;
  status: 'Critical' | 'Stable' | 'Recovering' | 'Discharged';
  room: string;
  bloodType: string;
  avatar: string;
  initials: string;
  vitals: {
    bp: string;
    hr: number;
    spo2: number;
    temp: number;
  };
  medications: { name: string; dose: string; frequency: string }[];
  allergies: string[];
  timeline: { time: string; event: string }[];
  admittedAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'critical' | 'info' | 'warning' | 'success';
  unread: boolean;
}

export interface AuthUser {
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'nurse';
  initials: string;
}

export type ViewMode = 'grid' | 'list';
export type StatusFilter = 'all' | 'Critical' | 'Stable' | 'Recovering' | 'Discharged';
