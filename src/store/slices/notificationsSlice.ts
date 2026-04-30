import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';
import { mockNotifications } from '../../utils/mockData';

interface NotificationsState {
  notifications: Notification[];
  panelOpen: boolean;
}

const initialState: NotificationsState = {
  notifications: mockNotifications,
  panelOpen: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      state.notifications.unshift({
        ...action.payload,
        id: `N${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead: (state) => {
      state.notifications.forEach(n => { n.read = true; });
    },
    togglePanel: (state) => {
      state.panelOpen = !state.panelOpen;
    },
    closePanel: (state) => {
      state.panelOpen = false;
    },
  },
});

export const { addNotification, markAsRead, markAllRead, togglePanel, closePanel } = notificationsSlice.actions;
export default notificationsSlice.reducer;
