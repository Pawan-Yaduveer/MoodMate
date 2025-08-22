import { createContext, useState, useEffect, useContext } from "react";
import api, { setAuthToken } from "../utils/api";

// 1️⃣ Create context
const AuthContext = createContext();

// 2️⃣ Create provider component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  const register = async (formData) => {
    try {
      const res = await api.post("/api/auth/register", formData);
      return res.data;
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const res = await api.post("/api/auth/login", credentials);
      const { data } = res.data; // Backend returns { success: true, data: { user, token } }
      const { token, user } = data;

      // Set token first
      setAuthToken(token);
      
      // Then update state
      setUser(user);
      setIsAuthenticated(true);
      
      console.log('Login successful:', { user, token: token ? 'present' : 'missing' });
      
      // Small delay to ensure state is stable
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return res.data;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put("/api/auth/profile", profileData);
      if (res.data.success) {
        // Update local user state with new profile data
        setUser(prevUser => ({
          ...prevUser,
          ...res.data.data.user
        }));
        return { success: true };
      } else {
        return { success: false, error: res.data.message || 'Profile update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log('AuthContext useEffect - token from localStorage:', token ? 'present' : 'missing');
    
    if (token) {
      setAuthToken(token);
      api
        .get("/api/auth/profile")
        .then((res) => {
          console.log('AuthContext - /api/auth/profile success:', res.data);
          // The response structure is { success: true, data: { user } }
          setUser(res.data.data.user);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error('AuthContext - /api/auth/profile failed:', error);
          setAuthToken(null);
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      console.log('AuthContext - no token found, setting loading to false');
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, error, clearError, register, updateProfile, api }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 3️⃣ Custom hook
const useAuth = () => useContext(AuthContext);

// 4️⃣ Export
export { AuthProvider, useAuth };
export default AuthContext;
