import { useState } from "react";

const GOOGLE_OAUTH_CLIENT_ID = "616224709695-4idna2c5eedetlt5og1lhetbfesd6oea.apps.googleusercontent.com";
const GOOGLE_OAUTH_REDIRECT_URL = "http://localhost:5173/oauth/google/callback";
const GOOGLE_OAUTH_CONSENT_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";

const GOOGLE_OAUTH_SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/gmail.readonly",
].join(" ");

export const useGoogleAuthentication = () => {
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setLoading(true);

    const state = crypto.randomUUID()

    sessionStorage.setItem("google_oauth_state", state);

    const url = new URL(GOOGLE_OAUTH_CONSENT_ENDPOINT);

    url.searchParams.set("scope", GOOGLE_OAUTH_SCOPES);
    url.searchParams.set("client_id", GOOGLE_OAUTH_CLIENT_ID);
    url.searchParams.set("redirect_uri", GOOGLE_OAUTH_REDIRECT_URL);

    url.searchParams.set("state", state);
    url.searchParams.set("prompt", "consent");
    url.searchParams.set("response_type", "code");
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("include_granted_scopes", "true");

    window.location.assign(url.toString());
  };

  return Object.freeze({
    loading,
    start,
  });
};
