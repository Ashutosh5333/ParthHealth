export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'doctor' | 'nurse';
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  condition: string;
  status: 'Critical' | 'Stable' | 'Recovering' | 'Discharged';
  doctor: string;
  admissionDate: string;
  room: string;
  phone: string;
  email: string;
  insurance: string;
  lastVisit: string;
  nextAppointment: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSaturation: number;
  };
  medications: string[];
  allergies: string[];
  notes: string;
}

export interface AnalyticsData {
  admissions: { month: string; count: number }[];
  departments: { name: string; patients: number; beds: number }[];
  outcomes: { status: string; value: number; color: string }[];
  revenue: { month: string; revenue: number; expenses: number }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
}
