import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './core/routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


function App() {

  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  )
}

export default App
  // <div>
    //   <AccordsDevis/>
    // </div>