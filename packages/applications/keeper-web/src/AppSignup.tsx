import * as React from 'react'

import { useGoogleAuthentication } from './hooks/useGoogleAuth';

export function GoogleConnectButton() {
  const { loading, start } = useGoogleAuthentication();

  const handleClick = React.useCallback(() => void start(), [start]);

  return (
    <button type='button' onClick={handleClick} disabled={loading}>
      {loading ? 'Connecting...' : 'Connect with Gmail'}
    </button>
  );
}

export function AppSignup() {
  return (
    <div>
      <h1>Keeper</h1>
      <GoogleConnectButton/>
    </div>
  )
}