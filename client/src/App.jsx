// import './App.css';
import { Outlet } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
// Uncomment import statement below after building queries and mutations
// import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
// import { Buffer } from 'buffer';
function App() {
  // window.Buffer = Buffer;
  return (
    <CookiesProvider>
    <div>
      <Outlet />
    </div>
    </CookiesProvider>
      );
}

export default App;
