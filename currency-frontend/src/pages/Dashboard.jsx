import { useEffect, useState } from "react";
import api from "../api/axios";
import { logout } from "../utils/auth";
import toast from "react-hot-toast";
import { FiTrendingUp, FiTrendingDown, FiCreditCard, FiDownload, FiStar, FiSend, FiPlusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [converter, setConverter] = useState({
    from: 'USD',
    to: 'INR',
    amount: 1,
    result: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, currenciesRes, favoritesRes, walletsRes, txRes] = await Promise.all([
        api.get("/analytics/"),
        api.get("/currencies/"),
        api.get("/favorites/"),
        api.get("/wallets/"),
        api.get("/transactions/?limit=5")
      ]);

      setAnalytics(analyticsRes.data);
      setCurrencies(currenciesRes.data);
      setFavorites(favoritesRes.data);
      setWallets(walletsRes.data);
      setRecentTx(txRes.data.slice(0, 5));
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        toast.error("Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = async () => {
    try {
      const res = await api.post("/convert/", {
        from_currency: converter.from,
        to_currency: converter.to,
        amount: converter.amount
      });
      setConverter(prev => ({ ...prev, result: res.data.converted_amount }));
    } catch (err) {
      toast.error("Conversion failed");
    }
  };

  const toggleFavorite = async (currencyCode) => {
    try {
      if (favorites.includes(currencyCode)) {
        await api.delete("/favorites/", { data: { currency_code: currencyCode } });
        setFavorites(prev => prev.filter(f => f !== currencyCode));
      } else {
        await api.post("/favorites/", { currency_code: currencyCode });
        setFavorites(prev => [...prev, currencyCode]);
      }
    } catch (err) {
      toast.error("Failed to update favorites");
    }
  };

  const exportTransactions = () => {
    window.open(`${api.defaults.baseURL}transactions/export/`, '_blank');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back!</h1>
        <p className="dashboard-subtitle">Here's your financial overview</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/send-money" className="action-card">
          <FiSend />
          <span>Send Money</span>
        </Link>
        <Link to="/topup" className="action-card">
          <FiPlusCircle />
          <span>Top Up</span>
        </Link>
        <Link to="/wallets" className="action-card">
          <FiCreditCard />
          <span>Wallets</span>
        </Link>
        <Link to="/transactions" className="action-card">
          <FiTrendingUp />
          <span>Transactions</span>
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <FiTrendingUp className="card-icon sent" />
          <div>
            <h3>Total Sent</h3>
            <p>${analytics?.total_sent || 0}</p>
          </div>
        </div>
        <div className="analytics-card">
          <FiTrendingDown className="card-icon received" />
          <div>
            <h3>Total Received</h3>
            <p>${analytics?.total_received || 0}</p>
          </div>
        </div>
        <div className="analytics-card">
          <FiCreditCard className="card-icon" />
          <div>
            <h3>Wallets</h3>
            <p>{wallets.length}</p>
          </div>
        </div>
        <div className="analytics-card">
          <FiCreditCard className="card-icon" />
          <div>
            <h3>Transactions</h3>
            <p>{analytics?.transaction_count || 0}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Currency Converter */}
        <div className="dashboard-card">
          <h3>Currency Converter</h3>
          <div className="converter-form">
            <div className="converter-row">
              <input
                type="number"
                value={converter.amount}
                onChange={(e) => setConverter(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Amount"
              />
              <select
                value={converter.from}
                onChange={(e) => setConverter(prev => ({ ...prev, from: e.target.value }))}
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
              <span>to</span>
              <select
                value={converter.to}
                onChange={(e) => setConverter(prev => ({ ...prev, to: e.target.value }))}
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
              <button onClick={convertCurrency} className="btn-primary">Convert</button>
            </div>
            {converter.result && (
              <div className="converter-result">
                <strong>{converter.amount} {converter.from} = {converter.result} {converter.to}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Favorite Currencies */}
        <div className="dashboard-card">
          <h3>Favorite Currencies</h3>
          <div className="favorites-list">
            {currencies.slice(0, 8).map(currency => (
              <div key={currency.code} className="favorite-item">
                <span>{currency.code} - {currency.name}</span>
                <button onClick={() => toggleFavorite(currency.code)}>
                  <FiStar className={`star ${favorites.includes(currency.code) ? 'filled' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Transactions</h3>
            <button onClick={exportTransactions} className="export-btn">
              <FiDownload /> Export
            </button>
          </div>
          <div className="recent-tx">
            {recentTx.length === 0 ? (
              <p>No transactions yet</p>
            ) : (
              recentTx.map(tx => (
                <div key={tx.id} className="tx-item">
                  <div className="tx-info">
                    <span className="tx-type">{tx.type}</span>
                    <span className="tx-amount">
                      {tx.type === 'sent' ? tx.amount_sent : tx.amount_received} {tx.type === 'sent' ? tx.from_currency : tx.to_currency}
                    </span>
                  </div>
                  <span className="tx-date">{new Date(tx.created_at).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Wallet Summary */}
        <div className="dashboard-card">
          <h3>Wallet Summary</h3>
          <div className="wallet-summary">
            {wallets.map(wallet => (
              <div key={wallet.id} className="wallet-summary-item">
                <span className="wallet-code">{wallet.currency}</span>
                <span className="wallet-balance">{wallet.balance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;