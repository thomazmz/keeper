import * as ReactRouter from "react-router-dom";

import { HomePage } from './pages/HomePage';
import { SignupPage } from './pages/SignUpPage'


export function AppRouter() {
  return (
    <ReactRouter.Routes>
      <ReactRouter.Route path="/" element={<HomePage />} />
      <ReactRouter.Route path="/home" element={<HomePage />} />
      <ReactRouter.Route path="/signup" element={<SignupPage />} />
      <ReactRouter.Route path="*" element={<ReactRouter.Navigate to="/" replace />} />
    </ReactRouter.Routes>
  );
}
