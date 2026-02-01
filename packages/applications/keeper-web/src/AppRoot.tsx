import { AppRouter } from './AppRouter';

import * as React from 'react'
import * as ReactDom from 'react-dom/client'
import * as ReactQuery from '@tanstack/react-query';
import * as ReactRouter from 'react-router-dom';

const queryClient = new ReactQuery.QueryClient();

ReactDom.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactRouter.BrowserRouter>
      <ReactQuery.QueryClientProvider client={queryClient}>
        <AppRouter/>
      </ReactQuery.QueryClientProvider>
    </ReactRouter.BrowserRouter>
  </React.StrictMode>,
)
