import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  FiSend,
  FiMail,
  FiArrowRightCircle,
  FiDollarSign,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SUPPORTED_CURRENCIES = ["INR", "USD", "EUR"];

function SendMoney() {
  const [wallets, setWallets] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("INR");
  const [toEmail, setToEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const res = await api.get("/wallets/");
      setWallets(res.data);

      if (res.data.length > 0) {
        setFromCurrency(res.data[0].currency);
      }
    } catch {
      toast.error("Failed to load wallets");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (wallets.length === 0) {
      toast.error("Please create a wallet first");
      navigate("/wallets");
      return;
    }

    const numericAmount = Number(amount);

    if (!toEmail || !numericAmount || numericAmount <= 0) {
      toast.error("Please enter valid details");
      return;
    }

    setLoading(true);
    try {
      await api.post("/send-money/", {
        receiver_email: toEmail,
        from_currency: fromCurrency,
        to_currency: toCurrency,
        amount: numericAmount,
      });

      toast.success("Money sent successfully");
      setAmount("");
      setToEmail("");
      fetchWallets(); // Refresh wallets after send
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Transaction failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading wallets...</p>
        </div>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="page-container">
        <p>You don&apos;t have any wallets yet.</p>
        <button onClick={() => navigate("/wallets")} className="btn-primary">
          Create Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-card">
        <h2 className="page-title">
          <FiSend /> Send Money
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Receiver Email</label>
          <div className="input-group">
            <FiMail />
            <input
              type="email"
              placeholder="user@example.com"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
            />
          </div>

          <label>From Wallet</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {wallets.map((w) => (
              <option key={w.id} value={w.currency}>
                {w.currency}
              </option>
            ))}
          </select>

          <label>To Currency</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label>Amount</label>
          <div className="input-group">
            <FiDollarSign />
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            <FiArrowRightCircle />
            {loading ? "Sending..." : "Send Money"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SendMoney;
