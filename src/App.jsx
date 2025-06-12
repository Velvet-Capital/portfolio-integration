import './App.css'
import { MetaMaskProvider, useMetaMask } from './contexts/MetaMaskContext'
import CreatePortfolio from './components/CreatePortfolio'

function WalletConnect() {
  const { account, error, connectWallet, disconnectWallet } = useMetaMask();

  return (
    <div className="wallet-connect">
      {error && <p className="error">{error}</p>}
      {!account ? (
        <button onClick={connectWallet} className="connect-button">
          Connect MetaMask
        </button>
      ) : (
        <div className="wallet-info">
          <p>Connected Account: {account.slice(0, 6)}...{account.slice(-4)}</p>
          <button onClick={disconnectWallet} className="disconnect-button">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <MetaMaskProvider>
      <div className="app-container">
        <div className="header">
          <h1>Portfolio Test</h1>
          <WalletConnect />
        </div>
        <div className="card">
          <CreatePortfolio />
        </div>
      </div>
    </MetaMaskProvider>
  )
}

export default App
