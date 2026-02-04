import * as React from 'react';
import * as Router from 'react-router-dom';

import { useQuery } from '../hooks/useQuery';
import { useGoogleOauth } from '../hooks/useGoogleOauth';

export function SignupPage() {
  const navigate = Router.useNavigate()

  const query = useQuery()

  const oauth = useGoogleOauth()

  const code = query.get("code")

  React.useEffect(() => {
    if(!code) return
    query.reset()
    oauth.connect(code)
  }, [code])

  if(oauth.data) {
    return (
      <div>
        <h1>Sign Up for Keeper</h1>
        <p>Your account was created.</p>
        <button type="button" onClick={() => navigate('/')}>Go back</button>
      </div>
    )
  }

  if(oauth.error) {
    return (
      <div>
        <h1>Sign Up for Keeper</h1>
        <p>We couldn’t connect your Google account. Please try again.</p>
        <button type="button" onClick={() => navigate('/')}>Go back</button>
        <button type="button" onClick={() => oauth.start()}>Try again</button>
      </div>
    )
  }

  if(oauth.loading) {
    return (
      <div>
        <h1>Sign Up for Keeper</h1>
        <button type="button" disabled>Connecting…</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Sign Up for Keeper</h1>
      <p>Continue with Google to create your account and grant email access.</p>
      <button type="button" onClick={() => navigate('/')}>Go back</button>
      <button type="button" onClick={oauth.start}>Continue with Google</button>
    </div>
  );
}
