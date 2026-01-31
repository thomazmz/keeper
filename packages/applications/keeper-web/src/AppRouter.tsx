import * as ReactRouter from "react-router-dom";

import { AppHome } from "./AppHome";
import { AppSignup } from './AppSignup'

export function AppRouter() {
  return (
    <ReactRouter.Routes>
      <ReactRouter.Route path="/" element={<AppHome />} />
      <ReactRouter.Route path="/signup" element={<AppSignup />} />
      <ReactRouter.Route path="/oauth/google" element={<AppHome />} />
      <ReactRouter.Route path="/oauth/google/callback" element={<AppHome />} />
      <ReactRouter.Route path="*" element={<ReactRouter.Navigate to="/" replace />} />
    </ReactRouter.Routes>
  );
}
