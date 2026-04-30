import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Patient } from '../../types';
import { mockPatients } from '../../utils/mockData';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'All' | 'Critical' | 'Stable' | 'Recovering' | 'Discharged';

interface PatientsState {
  patients: Patient[];
  viewMode: ViewMode;
  searchQuery: string;
  statusFilter: StatusFilter;
  selectedPatient: Patient | null;
  loading: boolean;
}

const initialState: PatientsState = {
  patients: mockPatients,
  viewMode: 'grid',
  searchQuery: '',
  statusFilter: 'All',
  selectedPatient: null,
  loading: false,
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<StatusFilter>) => {
      state.statusFilter = action.payload;
    },
    setSelectedPatient: (state, action: PayloadAction<Patient | null>) => {
      state.selectedPatient = action.payload;
    },
    updatePatient: (state, action: PayloadAction<Patient>) => {
      const idx = state.patients.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.patients[idx] = action.payload;
    },
  },
});

export const { setViewMode, setSearchQuery, setStatusFilter, setSelectedPatient, updatePatient } = patientsSlice.actions;
export default patientsSlice.reducer;
