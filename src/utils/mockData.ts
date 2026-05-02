import { Patient, Notification } from '../types';

export const PATIENTS: Patient[] = [
  {
    id: 'P001', name: 'Arjun Sharma', age: 52, gender: 'M',
    condition: 'Acute Myocardial Infarction', status: 'Critical', room: 'ICU-3',
    bloodType: 'O+', avatar: '#ff6b6b', initials: 'AS',
    vitals: { bp: '145/95', hr: 108, spo2: 94, temp: 38.2 },
    medications: [
      { name: 'Aspirin', dose: '325mg', frequency: 'Once daily' },
      { name: 'Atorvastatin', dose: '80mg', frequency: 'Once daily' },
      { name: 'Metoprolol', dose: '25mg', frequency: 'Twice daily' },
    ],
    allergies: ['Penicillin'],
    timeline: [
      { time: '08:15', event: 'ECG performed — ST elevation noted in V1-V4' },
      { time: '07:40', event: 'Troponin I elevated: 2.4 ng/mL (critical)' },
      { time: '06:30', event: 'Admitted via Emergency — chest pain, diaphoresis' },
      { time: 'Yesterday 22:00', event: 'Patient reported chest pain at home' },
    ],
    admittedAt: '2026-05-02T06:30:00',
  },
  {
    id: 'P002', name: 'Priya Patel', age: 34, gender: 'F',
    condition: 'Community-Acquired Pneumonia', status: 'Recovering', room: 'Ward-2B',
    bloodType: 'A+', avatar: '#74b9ff', initials: 'PP',
    vitals: { bp: '118/76', hr: 82, spo2: 97, temp: 37.8 },
    medications: [
      { name: 'Amoxicillin', dose: '500mg', frequency: 'Three times daily' },
      { name: 'Azithromycin', dose: '250mg', frequency: 'Once daily' },
    ],
    allergies: [],
    timeline: [
      { time: '10:00', event: 'Chest X-ray shows significant improvement' },
      { time: 'Yesterday 14:00', event: 'IV antibiotics switched to oral' },
      { time: 'Yesterday 09:00', event: 'Admitted with high fever (39.4°C) and productive cough' },
    ],
    admittedAt: '2026-05-01T09:00:00',
  },
  {
    id: 'P003', name: 'Kavita Rao', age: 67, gender: 'F',
    condition: 'Diabetic Ketoacidosis', status: 'Critical', room: 'ICU-1',
    bloodType: 'B+', avatar: '#fd79a8', initials: 'KR',
    vitals: { bp: '130/85', hr: 118, spo2: 96, temp: 37.1 },
    medications: [
      { name: 'Insulin (Regular)', dose: '0.1 unit/kg/hr', frequency: 'IV Drip' },
      { name: 'Normal Saline', dose: '1L/hr', frequency: 'IV Infusion' },
      { name: 'Potassium Chloride', dose: '20 mEq/L', frequency: 'IV Infusion' },
    ],
    allergies: ['Sulfa drugs'],
    timeline: [
      { time: '09:00', event: 'Blood glucose: 320 mg/dL — anion gap 22' },
      { time: '07:00', event: 'IV fluid resuscitation and insulin drip started' },
      { time: '05:00', event: 'Admitted via ER — altered consciousness, Kussmaul breathing' },
    ],
    admittedAt: '2026-05-02T05:00:00',
  },
  {
    id: 'P004', name: 'Rohit Mehta', age: 28, gender: 'M',
    condition: 'Acute Appendicitis (Post-op)', status: 'Stable', room: 'Ward-4A',
    bloodType: 'AB-', avatar: '#00cec9', initials: 'RM',
    vitals: { bp: '120/80', hr: 76, spo2: 99, temp: 36.8 },
    medications: [
      { name: 'Paracetamol', dose: '1g', frequency: 'Every 6 hours' },
      { name: 'Ceftriaxone', dose: '1g', frequency: 'IV Once daily' },
    ],
    allergies: [],
    timeline: [
      { time: '11:00', event: 'Post-op recovery excellent — ambulating independently' },
      { time: '07:30', event: 'Laparoscopic appendectomy completed — no complications' },
      { time: '06:00', event: 'Taken to OR' },
    ],
    admittedAt: '2026-05-02T04:00:00',
  },
  {
    id: 'P005', name: 'Sunita Krishnan', age: 45, gender: 'F',
    condition: 'Hypertensive Emergency', status: 'Critical', room: 'ICU-2',
    bloodType: 'O-', avatar: '#e17055', initials: 'SK',
    vitals: { bp: '185/120', hr: 98, spo2: 95, temp: 37.4 },
    medications: [
      { name: 'Labetalol', dose: '2mg/min', frequency: 'IV Infusion' },
      { name: 'Amlodipine', dose: '10mg', frequency: 'Once daily' },
    ],
    allergies: ['Aspirin'],
    timeline: [
      { time: '08:45', event: 'BP slowly responding — now 185/120 from 210/135' },
      { time: '07:00', event: 'IV antihypertensives initiated' },
      { time: '06:00', event: 'Admitted — BP 210/135, severe headache, blurred vision' },
    ],
    admittedAt: '2026-05-02T06:00:00',
  },
  {
    id: 'P006', name: 'Anil Desai', age: 73, gender: 'M',
    condition: 'COPD Exacerbation', status: 'Stable', room: 'Ward-1C',
    bloodType: 'A-', avatar: '#a29bfe', initials: 'AD',
    vitals: { bp: '128/82', hr: 88, spo2: 93, temp: 37.0 },
    medications: [
      { name: 'Salbutamol', dose: '2.5mg', frequency: 'Nebulizer every 4 hrs' },
      { name: 'Ipratropium', dose: '0.5mg', frequency: 'Nebulizer every 6 hrs' },
      { name: 'Prednisolone', dose: '40mg', frequency: 'Once daily' },
    ],
    allergies: [],
    timeline: [
      { time: '10:30', event: 'SpO₂ improved to 93% on 2L O₂ nasal cannula' },
      { time: 'Yesterday 18:00', event: 'Chest physiotherapy started' },
      { time: 'Yesterday 12:00', event: 'Admitted with acute breathlessness and wheeze' },
    ],
    admittedAt: '2026-05-01T12:00:00',
  },
  {
    id: 'P007', name: 'Meera Joshi', age: 22, gender: 'F',
    condition: 'Appendicitis (Post-op Day 1)', status: 'Recovering', room: 'Ward-3B',
    bloodType: 'B-', avatar: '#55efc4', initials: 'MJ',
    vitals: { bp: '116/74', hr: 72, spo2: 99, temp: 36.6 },
    medications: [
      { name: 'Ibuprofen', dose: '400mg', frequency: 'Every 8 hours with food' },
      { name: 'Ondansetron', dose: '4mg', frequency: 'Every 8 hours PRN' },
    ],
    allergies: [],
    timeline: [
      { time: '12:00', event: 'Walking assisted, appetite returning — clear fluids tolerated' },
      { time: 'Yesterday 14:00', event: 'Surgery completed without complications' },
      { time: 'Yesterday 10:00', event: 'Admitted via ER with RIF pain and rebound tenderness' },
    ],
    admittedAt: '2026-05-01T10:00:00',
  },
  {
    id: 'P008', name: 'Vikram Singh', age: 58, gender: 'M',
    condition: 'TIA / Stroke Recovery', status: 'Discharged', room: '—',
    bloodType: 'O+', avatar: '#6c5ce7', initials: 'VS',
    vitals: { bp: '132/84', hr: 78, spo2: 98, temp: 36.9 },
    medications: [
      { name: 'Clopidogrel', dose: '75mg', frequency: 'Once daily' },
      { name: 'Atorvastatin', dose: '40mg', frequency: 'Once daily' },
      { name: 'Ramipril', dose: '5mg', frequency: 'Once daily' },
    ],
    allergies: ['Codeine'],
    timeline: [
      { time: 'Today 09:00', event: 'Discharged with follow-up in 1 week with neurology' },
      { time: 'Yesterday', event: 'Physiotherapy session — good progress, no focal deficits' },
      { time: '3 days ago', event: 'Admitted post TIA — transient left arm weakness' },
    ],
    admittedAt: '2026-04-29T08:00:00',
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'Critical Alert', message: 'Arjun Sharma (ICU-3) — BP spike: 165/105 mmHg', time: '2 min ago', type: 'critical', unread: true },
  { id: 2, title: 'Lab Results Ready', message: 'Blood work for Kavita Rao now available in EMR', time: '8 min ago', type: 'info', unread: true },
  { id: 3, title: 'New Admission', message: 'New patient admitted to Ward-2B with suspected pneumonia', time: '25 min ago', type: 'info', unread: true },
  { id: 4, title: 'Medication Due', message: 'Sunita Krishnan — Labetalol dose due in 15 min', time: '30 min ago', type: 'warning', unread: false },
  { id: 5, title: 'Discharge Completed', message: 'Vikram Singh successfully discharged', time: '1 hr ago', type: 'success', unread: false },
];

export const ANALYTICS_DATA = {
  monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    admissions: [42, 38, 55, 48, 62, 57, 70, 65, 58, 72, 68, 75],
    discharges: [38, 35, 50, 44, 58, 52, 65, 60, 55, 68, 64, 70],
  },
  weekly: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    admissions: [28, 35, 22, 41, 38, 30, 44],
  },
  departments: [
    { name: 'General', value: 32, color: '#4dabf7' },
    { name: 'Cardiology', value: 24, color: '#00d4aa' },
    { name: 'ICU', value: 18, color: '#ff4d6d' },
    { name: 'Neurology', value: 14, color: '#ffa94d' },
    { name: 'Orthopaedics', value: 12, color: '#cc5de8' },
  ],
  bedUtilization: [72, 75, 78, 80, 76, 84, 82, 88, 85, 90, 87, 84],
  statusBreakdown: [
    { name: 'Stable', value: 45, color: '#4dabf7' },
    { name: 'Recovering', value: 30, color: '#ffa94d' },
    { name: 'Critical', value: 15, color: '#ff4d6d' },
    { name: 'Discharged', value: 10, color: '#cc5de8' },
  ],
};

export const DOCTORS = [
  { name: 'Dr. Anjali Mehta', dept: 'Cardiology', status: 'online' as const },
  { name: 'Dr. Ravi Gupta', dept: 'ICU / Critical Care', status: 'busy' as const },
  { name: 'Dr. Sneha Iyer', dept: 'General Medicine', status: 'online' as const },
  { name: 'Dr. Prakash Rao', dept: 'Emergency', status: 'busy' as const },
  { name: 'Dr. Nisha Verma', dept: 'Neurology', status: 'online' as const },
  { name: 'Dr. Sanjay Kumar', dept: 'Pulmonology', status: 'online' as const },
  { name: 'Dr. Lakshmi Das', dept: 'Endocrinology', status: 'busy' as const },
];

export const ACTIVITY_FEED = [
  { color: '#ff4d6d', text: '<strong>Arjun Sharma</strong> — BP elevated to 165/105. Cardiologist notified.', time: '2 min ago' },
  { color: '#00d4aa', text: '<strong>Priya Patel</strong> — SpO₂ improved to 97%. Recovery progressing well.', time: '8 min ago' },
  { color: '#4dabf7', text: 'Lab results for <strong>Kavita Rao</strong> are now available in the EMR.', time: '25 min ago' },
  { color: '#ffa94d', text: '<strong>Dr. Mehta</strong> started shift in Cardiology ICU.', time: '1 hr ago' },
  { color: '#6c5ce7', text: '<strong>Vikram Singh</strong> successfully discharged. Follow-up in 1 week.', time: '1 hr ago' },
  { color: '#55efc4', text: 'Physiotherapy session completed for <strong>Meera Joshi</strong>.', time: '2 hr ago' },
];
