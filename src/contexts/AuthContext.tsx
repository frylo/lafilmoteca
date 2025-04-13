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
        lastLogin: serverTimestamp()
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

    console.log('[signIn] Usuario autenticado:', {
      uid: firebaseUser.uid,
      email: firebaseUser.email
    });

    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true });
      console.log('[signIn] setDoc de lastLogin completado');
    } catch (firestoreErr) {
      console.error('[signIn] Error al hacer setDoc de lastLogin:', firestoreErr);
      throw firestoreErr;
    }

  } catch (err: any) {
    console.error('[signIn] FirebaseAuth error:', err);

    if (err.code === 'auth/configuration-not-found') {
      setError('Error de configuración en Firebase. Por favor, contacte al administrador.');
    } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      setError('Email o contraseña incorrectos.');
    } else if (err.code === 'auth/too-many-requests') {
      setError('Demasiados intentos fallidos. Por favor, inténtelo más tarde.');
    } else if (err.code === 'permission-denied' || err.message?.includes('permission')) {
      setError('Permisos insuficientes para acceder a los datos. Verifica las reglas de Firestore.');
    } else {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }

    throw err;
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
        // Maximum number of retry attempts for Firestore operations
        const maxRetries = 5; // Increased from 3 to 5
        let retryCount = 0;
        let success = false;
        const startTime = Date.now();  // Registrar el tiempo de inicio
        const maxRetryTime = 30000;    // Tiempo máximo de reintento (30 segundos)
        
        // Function to calculate exponential backoff delay
        const getBackoffDelay = (attempt: number) => {
          // Base delay is 1000ms, with exponential increase and some randomness
          return Math.min(Math.pow(2, attempt) * 1000 + Math.random() * 1000, 30000); // Max 30 seconds
        };

        // Function to handle Firestore operations with retry logic
        const fetchUserDataWithRetry = async () => {
          while (retryCount < maxRetries && !success && (Date.now() - startTime) < maxRetryTime) {
            try {
              console.log(`fetchUserDataWithRetry: Intento ${retryCount + 1}/${maxRetries} para el usuario ${firebaseUser.uid}`);
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              
              if (userDoc.exists()) {
                const userData = userDoc.data();
                setCurrentUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  displayName: userData.displayName || firebaseUser.displayName || '',
                  photoURL: userData.photoURL || firebaseUser.photoURL || ''
                });
                setUserRole(userData.role || 'user');
                success = true;
                console.log("fetchUserDataWithRetry: Éxito al obtener los datos del usuario");
              } else {
                console.log("fetchUserDataWithRetry: El documento del usuario no existe. Creando uno nuevo.");
                // If user document doesn't exist in Firestore, create it
                await setDoc(doc(db, 'users', firebaseUser.uid), {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  role: 'user', // Default role
                  createdAt: serverTimestamp(),
                  lastLogin: serverTimestamp()
                });
                
                setCurrentUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  displayName: firebaseUser.displayName || '',
                  photoURL: firebaseUser.photoURL || ''
                });
                setUserRole('user');
                success = true;
              }
            } catch (err: any) {
              retryCount++;
              console.error(`fetchUserDataWithRetry: Error en el intento ${retryCount}:`, err);
              
              const isLikelyNetworkError = (
                err.code === 'unavailable' ||
                err.code === 'resource-exhausted' ||
                err.code === 'deadline-exceeded' ||
                err.message?.includes('network') ||
                err.message?.includes('transport errored') ||
                err.message?.includes('WebChannelConnection') ||
                err.message?.includes('RPC') ||
                err.message?.includes('stream') ||
                err.message?.includes('connection')
              );
              
              if (isLikelyNetworkError) {
                // If we haven't reached max retries, wait before trying again with exponential backoff
                if (retryCount < maxRetries) {
                  const delay = getBackoffDelay(retryCount);
                  console.log(`fetchUserDataWithRetry: Posible error de red. Reintentando en ${delay}ms`);
                  await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                  setError('Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.');
                  console.warn('Maximum retry attempts reached for network error');
                }
              } else {
                // For non-network errors, don't retry
                setError('Error al cargar datos del usuario');
                console.error('Firestore WebChannelConnection error:', err); // Log detailed error information
                break;
              }
            }
          }

          if (!success) {
            console.error("fetchUserDataWithRetry: Tiempo máximo de reintento alcanzado o error no recuperable.");
            setError('Error al cargar datos del usuario. Por favor, inténtelo más tarde.');
          }
        };

        // Execute the retry function
        await fetchUserDataWithRetry();
      } else {
        // No user is signed in
        setCurrentUser(null);
        setUserRole('guest'); // Default role for non-authenticated users
      }
      
      // Ensure loading state is set to false even if there were errors
      setLoading(false);
      
      // Log authentication state for debugging
      console.log('Auth state updated:', firebaseUser ? 'User authenticated' : 'No user');
    });

    // Cleanup subscription on unmount
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
