import './App.css';
import CustomRoutes from './routes/CustomRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google'; // นำเข้า GoogleOAuthProvider

function App() {
  return (
    <GoogleOAuthProvider clientId="672098494814-q3c25cfm17bg6lj7nhaa4oj22d8if7ah.apps.googleusercontent.com">
      <CustomRoutes />
    </GoogleOAuthProvider>

  );
}

export default App;
