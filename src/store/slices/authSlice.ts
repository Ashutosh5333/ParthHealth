import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { GoogleAuthProvider } from 'firebase/auth/web-extension';

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
        displayName: firebaseUser.displayName || 'User',
      
        role: email.includes('admin') ? 'admin' : email.includes('doctor') ? 'doctor' : 'nurse',
        token: token 
      };
      
      localStorage.setItem('raga_user', JSON.stringify(user));
      return user;
    } catch (error: any) {
      let message = 'Invalid email or password. Please try again.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.message.includes('INVALID_LOGIN_CREDENTIALS')) {
        message = 'Invalid credentials. Please check your email and password.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      }

      return rejectWithValue(message);
      // return rejectWithValue(error.message || 'Authentication failed');
    }
  }
);


// 2. Email Signup Thunk
export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ email, password, role }: { email: string; password: string, role: any }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); //[cite: 1]
      const token = await userCredential.user.getIdToken(); //[cite: 1]
      
      const user: User = {
        uid: userCredential.user.uid, //[cite: 1]
        email: userCredential.user.email || '', //[cite: 1]
        displayName: email.split('@')[0], //[cite: 1]
        role: role, //[cite: 1]
        token: token //[cite: 1]
      };
      
      localStorage.setItem('raga_user', JSON.stringify(user)); //[cite: 1]
      return user;
    } catch (error: any) {
      // CLEAN SIGNUP ERROR
      let message = 'Could not create account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please log in instead.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Use at least 6 characters.';
      }
      
      return rejectWithValue(message);
      // return rejectWithValue(error.message); //[cite: 1]
    }
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
      })


      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload; 
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    
  },
});

export const { restoreSession, clearError } = authSlice.actions;
export default authSlice.reducer;
