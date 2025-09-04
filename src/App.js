import './App.css';
import { CustomerRouter } from './routes/CustomerRouter';

function App() {

  // const dispatch = useDispatch()
  // const jwt = localStorage.getItem("jwt")
  // const {auth} = useSelector((store)=>store)

  // useEffect(()=>{
  //   dispatch(getUser(auth.jwt||jwt))
  //   dispatch(getAllRestaurant(jwt))
  //   dispatch(getAllCart(jwt))

  // },[auth.jwt||jwt])

  return (
      <CustomerRouter></CustomerRouter>
  );
}

export default App;
