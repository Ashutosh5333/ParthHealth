import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../utils/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const stored = localStorage.getItem('raga_user');
const initialState: AuthState = {
  user: stored ? JSON.parse(stored) : null,
  loading: false,
  error: null,
  isAuthenticated: !!stored,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || email.split('@')[0],
        role: email.includes('admin') ? 'admin' : email.includes('doctor') ? 'doctor' : 'nurse',
        token,
      };
      localStorage.setItem('raga_user', JSON.stringify(user));
      return user;
    } catch (error: any) {
      let message = 'Invalid email or password. Please try again.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || (error.message || '').includes('INVALID_LOGIN_CREDENTIALS')) {
        message = 'Invalid credentials. Please check your email and password.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection.';
      }
      return rejectWithValue(message);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ email, password, role }: { email: string; password: string; role: 'doctor' | 'nurse' }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const user: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: email.split('@')[0],
        role,
        token,
      };
      localStorage.setItem('raga_user', JSON.stringify(user));
      return user;
    } catch (error: any) {
      let message = 'Could not create account. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please log in instead.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Use at least 6 characters.';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection.';
      }
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await signOut(auth);
  localStorage.removeItem('raga_user');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    restoreSession: (state) => {
      const s = localStorage.getItem('raga_user');
      if (s) { state.user = JSON.parse(s); state.isAuthenticated = true; }
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => { state.loading = false; state.user = action.payload; state.isAuthenticated = true; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<User>) => { state.loading = false; state.user = action.payload; state.isAuthenticated = true; })
      .addCase(signupUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.isAuthenticated = false; });
  },
});

export const { restoreSession, clearError } = authSlice.actions;
export default authSlice.reducer;
