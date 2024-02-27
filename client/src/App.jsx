import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Outlet } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

// Uncomment import statement below after building queries and mutations
// import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
// import { Buffer } from 'buffer';
function App() {
  // window.Buffer = Buffer;
  return (
    <CookiesProvider>
    <div className='bg-custom'>
      <Outlet />
    </div>
    </CookiesProvider>
      );
}

export default App;
