import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  setStoredSession,
} from "../lib/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "medical-report-session";

function getStoredSession() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredSession());
  const [isChecking, setIsChecking] = useState(Boolean(getStoredSession()));

  useEffect(() => {
    if (!user) {
      setStoredSession(null);
      localStorage.removeItem(STORAGE_KEY);
      setIsChecking(false);
      return;
    }

    setStoredSession(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const storedUser = getStoredSession();

    async function syncCurrentUser() {
      if (!storedUser) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetchCurrentUser();

        if (isMounted) {
          setUser(response.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    }

    syncCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isChecking,
      async login(credentials) {
        const response = await loginUser(credentials);
        setUser(response.user);
        return response;
      },
      async register(payload) {
        const response = await registerUser(payload);
        setUser(response.user);
        return response;
      },
      async logout() {
        try {
          await logoutUser();
        } finally {
          setUser(null);
        }
      },
    }),
    [user, isChecking]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
