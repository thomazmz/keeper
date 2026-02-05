import { AppRouter } from './AppRouter';

// import * as React from 'react'
import * as ReactDom from 'react-dom/client'
import * as ReactRouter from 'react-router-dom';

ReactDom.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <ReactRouter.BrowserRouter>
        <AppRouter/>
    </ReactRouter.BrowserRouter>
  // </React.StrictMode>,
)
