import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';
import { INITIAL_NOTIFICATIONS } from '../../utils/mockData';

interface NotificationsState {
  notifications: Notification[];
  panelOpen: boolean;
}

const initialState: NotificationsState = {
  notifications: INITIAL_NOTIFICATIONS,
  panelOpen: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      state.notifications.unshift({ ...action.payload, id: Date.now() });
    },
    markAllRead: (state) => { state.notifications.forEach((n) => { n.unread = false; }); },
    markRead: (state, action: PayloadAction<number>) => {
      const n = state.notifications.find((x) => x.id === action.payload);
      if (n) n.unread = false;
    },
    togglePanel: (state) => { state.panelOpen = !state.panelOpen; },
    closePanel: (state) => { state.panelOpen = false; },
  },
});

export const { addNotification, markAllRead, markRead, togglePanel, closePanel } = notificationsSlice.actions;
export default notificationsSlice.reducer;
