import './App.css';
import { CustomerRouter } from './routes/CustomerRouter';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from './state/Authentication/Action';

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  
  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      dispatch(setAccessToken(accessToken));
    }
    else if (auth && auth.accessToken) {
      dispatch(setAccessToken(null));
    }
  }, [dispatch]);

  // Listen for sessionStorage changes to update Redux store
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken') {
        const accessToken = sessionStorage.getItem("accessToken");
        dispatch(setAccessToken(accessToken));
      }
    };

    // Add event listener for sessionStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);

  return (
    <CustomerRouter></CustomerRouter>
  );
}

export default App;