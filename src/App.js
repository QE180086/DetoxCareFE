import './App.css';
import { CustomerRouter } from './routes/CustomerRouter';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from './state/Authentication/Action';

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      dispatch(setAccessToken(accessToken));
    }
    else if (auth && auth.accessToken) {
      dispatch(setAccessToken(null));
    }
  }, [dispatch]);

  return (
    <CustomerRouter></CustomerRouter>
  );
}

export default App;