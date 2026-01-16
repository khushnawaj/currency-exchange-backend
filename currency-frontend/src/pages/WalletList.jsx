import { useEffect, useState } from "react";
import api from "../api/axios";
import { logout } from "../utils/auth";
import toast from "react-hot-toast";
import { FiCreditCard, FiPlus } from "react-icons/fi";

function WalletList() {
  const [wallets, setWallets] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchWallets();
    fetchCurrencies();
    fetchAnalytics();
  }, []);

  const fetchWallets = async () => {
    try {
      const res = await api.get("/wallets/");
      setWallets(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        toast.error("Failed to load wallets");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const res = await api.get("/currencies/");
      setCurrencies(res.data);
    } catch {
      toast.error("Failed to load currencies");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/analytics/");
      setAnalytics(res.data);
    } catch {
      // Optional, don't show error
    }
  };

  const getCurrencyLogo = (code) =>
    currencies.find((c) => c.code === code)?.logo;

  const createWallet = async () => {
    if (!currency) {
      toast.error("Please select a currency");
      return;
    }

    setCreating(true);
    try {
      await api.post("/wallets/", { currency });
      toast.success("Wallet created");
      setCurrency("");
      fetchWallets();
      fetchAnalytics();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create wallet");
    } finally {
      setCreating(false);
    }
  };

  const deleteWallet = async (walletId) => {
    if (!confirm("Are you sure you want to delete this wallet?")) return;

    try {
      await api.delete(`/wallets/${walletId}/`);
      toast.success("Wallet deleted");
      fetchWallets();
      fetchAnalytics();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete wallet");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading wallets...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="page-title">My Wallets</h2>

      {wallets.length === 0 ? (
        <div className="empty-wallet">
          <p>You don&apos;t have any wallets yet.</p>

          <div className="create-wallet-box">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="">Select currency</option>
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>

            <button onClick={createWallet} disabled={creating}>
              <FiPlus />
              {creating ? "Creating..." : "Create Wallet"}
            </button>
          </div>
        </div>
      ) : (
        <div className="wallet-grid">
          {wallets.map((wallet) => (
            <div className="wallet-card" key={wallet.id}>
              <div className="wallet-icon">
                {getCurrencyLogo(wallet.currency) ? (
                  <img
                    src={getCurrencyLogo(wallet.currency)}
                    alt={wallet.currency}
                    className="currency-logo"
                  />
                ) : (
                  <FiCreditCard />
                )}
              </div>

              <div className="wallet-info">
                <span className="wallet-currency">
                  {wallet.currency}
                </span>
                <span className="wallet-balance">
                  {wallet.balance}
                </span>
              </div>

              <button
                className="delete-wallet-btn"
                onClick={() => deleteWallet(wallet.id)}
                title="Delete Wallet"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {analytics && (
        <div className="analytics-section">
          <h3>Transaction Analytics</h3>
          <div className="analytics-grid">
            <div className="analytics-card">
              <strong>Total Sent:</strong> {analytics.total_sent}
            </div>
            <div className="analytics-card">
              <strong>Total Received:</strong> {analytics.total_received}
            </div>
            <div className="analytics-card">
              <strong>Transactions:</strong> {analytics.transaction_count}
            </div>
            <div className="analytics-card">
              <strong>Net Change:</strong> {analytics.net_balance_change}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletList;
