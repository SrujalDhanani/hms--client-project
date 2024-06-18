
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes1 } from './Routes.js';
import { SidebarProvider } from './SidebarProvider.js';


const apiSecretKey = process.env.REACT_APP_API_SECRET_KEY;
// console.log('API Secret Key:', apiSecretKey);

const apiBase = process.env.REACT_APP_API_BASE;
// console.log('API Base:', apiBase);

function App() 
{
  return (
    <SidebarProvider>
          <Routes1/>
    </SidebarProvider>
  );
}

export default App;
