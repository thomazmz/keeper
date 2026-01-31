import * as ReactRouter from 'react-router-dom'

export function AppHome() {
  const navigate = ReactRouter.useNavigate();

  return (
    <div>
      <h1>Keeper</h1>
      <p>A finance record-keeper that turn transactions from your emails in a searchable ledger.</p>
      <button type="button" onClick={() => navigate("/signup")}>Sign Up</button>
    </div>
  );
}