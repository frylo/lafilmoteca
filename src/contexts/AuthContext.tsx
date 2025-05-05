/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userRole: 'guest' | 'user' | 'admin' | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'guest' | 'user' | 'admin' | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Clear any authentication errors
  const clearError = () => setError(null);

  // Sign up a new user
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      clearError();
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user document in Firestore with role 'user'
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName,
        photoURL: firebaseUser.photoURL,
        role: 'user', // Default role for new users
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        isActive: true,
      });
      
    } catch (err: any) {
      // Handle specific Firebase auth errors
      if (err.code === 'auth/configuration-not-found') {
        setError('Error de configuración en Firebase. Por favor, contacte al administrador.');
        console.error('Firebase configuration error: Email/Password authentication may not be enabled in the Firebase console. Please enable Email/Password authentication in the Firebase console.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está registrado. Intente iniciar sesión.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es demasiado débil. Debe tener al menos 6 caracteres.');
      } else {
        setError(err instanceof Error ? err.message : 'Error al registrar usuario');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

// Sign in existing user
const signIn = async (email: string, password: string) => {
  try {
    setLoading(true);
    clearError();

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Verificar si el usuario está activo
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists() || !userDoc.data().isActive) {
      await firebaseSignOut(auth);
      setError('Tu cuenta ha sido desactivada. Por favor, contacta con el administrador.');
      setCurrentUser(null);
      setUserRole(null);
      return;
    }

    // Actualizar lastLogin
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      lastLogin: serverTimestamp()
    }, { merge: true });

    setCurrentUser(userDoc.data() as User);
    setUserRole(userDoc.data().role);
    
  } catch (err: any) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      setError('Email o contraseña incorrectos');
    } else if (err.code === 'auth/too-many-requests') {
      setError('Demasiados intentos fallidos. Por favor, inténtalo más tarde');
    } else {
      setError(err.message || 'Error al iniciar sesión');
    }
    setCurrentUser(null);
    setUserRole(null);
  } finally {
    setLoading(false);
  }
};

  // Sign out user
  const signOut = async () => {
    try {
      setLoading(true);
      clearError();
      await firebaseSignOut(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth state changes and fetch user data from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (!userDoc.exists() || !userDoc.data().isActive) {
            // Si el usuario no está activo, cerrar sesión y no actualizar el estado
            await firebaseSignOut(auth);
            setCurrentUser(null);
            setUserRole(null);
            setError('Tu cuenta ha sido desactivada. Por favor, contacta con el administrador.');
            return;
          }

          const userData = userDoc.data();
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: userData.displayName || firebaseUser.displayName || '',
            photoURL: userData.photoURL || firebaseUser.photoURL || '',
            role: userData.role || 'user',
            isActive: userData.isActive || true
          });
          setUserRole(userData.role || 'user');
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Error al cargar datos del usuario');
          setCurrentUser(null);
          setUserRole(null);
        }
      } else {
        // No user is signed in
        setCurrentUser(null);
        setUserRole('guest');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
