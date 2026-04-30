import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Simulate Firebase Auth
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const validCredentials = [
      { email: 'admin@raga.health', password: 'Admin@123', role: 'admin' as const, name: 'Dr. Admin User' },
      { email: 'doctor@raga.health', password: 'Doctor@123', role: 'doctor' as const, name: 'Dr. Priya Nair' },
      { email: 'nurse@raga.health', password: 'Nurse@123', role: 'nurse' as const, name: 'Nurse Ananya' },
    ];
    
    const cred = validCredentials.find(c => c.email === email && c.password === password);
    if (!cred) {
      return rejectWithValue('Invalid email or password. Please try again.');
    }
    
    const user: User = {
      uid: `uid_${Math.random().toString(36).substr(2, 9)}`,
      email: cred.email,
      displayName: cred.name,
      role: cred.role,
    };
    
    localStorage.setItem('raga_user', JSON.stringify(user));
    return user;
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  localStorage.removeItem('raga_user');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    restoreSession: (state) => {
      const stored = localStorage.getItem('raga_user');
      if (stored) {
        state.user = JSON.parse(stored);
        state.isAuthenticated = true;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { restoreSession, clearError } = authSlice.actions;
export default authSlice.reducer;
