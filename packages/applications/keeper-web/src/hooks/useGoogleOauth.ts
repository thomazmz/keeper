import * as React from 'react';

import { OauthApi } from '../api/OauthApi';

const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
const GOOGLE_OAUTH_REDIRECT_URL = import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URL;
const GOOGLE_OAUTH_CONSENT_ENDPOINT = import.meta.env.VITE_GOOGLE_OAUTH_CONSENT_ENDPOINT;
const GOOGLE_OAUTH_PROMPT = import.meta.env.VITE_GOOGLE_OAUTH_PROMPT;
const GOOGLE_OAUTH_ACCESS_TYPE = import.meta.env.VITE_GOOGLE_OAUTH_ACCESS_TYPE;
const GOOGLE_OAUTH_RESPONSE_TYPE = import.meta.env.VITE_GOOGLE_OAUTH_RESPONSE_TYPE;
const GOOGLE_OAUTH_INCLUDE_GRANTED_SCOPES = import.meta.env.VITE_GOOGLE_OAUTH_INCLUDE_GRANTED_SCOPES;

export function useGoogleOauth() {
  const [ loading, setLoading ] = React.useState(false)

  const [ error, setError ] = React.useState<OauthApi.ConnectWithGoogleError | undefined>(undefined)

  const [ data, setData ] = React.useState<OauthApi.ConnectWithGoogleResponse | undefined>(undefined)

  const connect = React.useCallback(async (code: OauthApi.ConnectWithGoogleRequest['code']) => {
    reset()
  
    void OauthApi.connectWithGoogle({ code })
      .then((result) => setData(result))
      .catch((error) => setError(error))
      .finally(() => setLoading(false))

  }, []);

  const reset = React.useCallback(() => {
    setData(undefined)
    setError(undefined)
    setLoading(false)
  }, [])

  const start = () => {
    const url = new URL(GOOGLE_OAUTH_CONSENT_ENDPOINT);

    console.log("prompt", GOOGLE_OAUTH_PROMPT)
    console.log("client_id", GOOGLE_OAUTH_CLIENT_ID)
    console.log("redirect_uri", GOOGLE_OAUTH_REDIRECT_URL)
    console.log("response_type", GOOGLE_OAUTH_RESPONSE_TYPE)
    console.log("access_type", GOOGLE_OAUTH_ACCESS_TYPE)
    console.log("include_granted_scopes", GOOGLE_OAUTH_INCLUDE_GRANTED_SCOPES)
    
    url.searchParams.set("prompt", GOOGLE_OAUTH_PROMPT);
    url.searchParams.set("client_id", GOOGLE_OAUTH_CLIENT_ID);
    url.searchParams.set("redirect_uri", GOOGLE_OAUTH_REDIRECT_URL);
    url.searchParams.set("response_type", GOOGLE_OAUTH_RESPONSE_TYPE);
    url.searchParams.set("access_type", GOOGLE_OAUTH_ACCESS_TYPE);
    url.searchParams.set("include_granted_scopes", GOOGLE_OAUTH_INCLUDE_GRANTED_SCOPES);

    url.searchParams.set("scope", [
      'https://www.googleapis.com/auth/gmail.readonly',
      'profile', 
      'openid',
      'email',
    ].join(' '));

    window.location.assign(url.toString());
  }

  return React.useMemo(() => ({
    reset, start, connect, data, error, loading,
  }), [reset, start, connect, data, error, loading ])
}
