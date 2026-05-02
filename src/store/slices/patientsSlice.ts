import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Patient, ViewMode, StatusFilter } from '../../types';
import { PATIENTS } from '../../utils/mockData';

interface PatientsState {
  patients: Patient[];
  viewMode: ViewMode;
  searchQuery: string;
  statusFilter: StatusFilter;
  selectedPatientId: string | null;
}

const initialState: PatientsState = {
  patients: PATIENTS,
  viewMode: 'grid',
  searchQuery: '',
  statusFilter: 'all',
  selectedPatientId: null,
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => { state.viewMode = action.payload; },
    setSearchQuery: (state, action: PayloadAction<string>) => { state.searchQuery = action.payload; },
    setStatusFilter: (state, action: PayloadAction<StatusFilter>) => { state.statusFilter = action.payload; },
    setSelectedPatient: (state, action: PayloadAction<string | null>) => { state.selectedPatientId = action.payload; },
  },
});

export const { setViewMode, setSearchQuery, setStatusFilter, setSelectedPatient } = patientsSlice.actions;
export default patientsSlice.reducer;
