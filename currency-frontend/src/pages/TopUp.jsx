import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { FiPlusCircle, FiDollarSign } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function TopUp() {
  const [wallets, setWallets] = useState([]);
  const [currency, setCurrency] = useState("");
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
        setCurrency(res.data[0].currency);
      }
    } catch {
      toast.error("Failed to load wallets");
    } finally {
      setFetchLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (wallets.length === 0) {
      toast.error("Please create a wallet first");
      navigate("/wallets");
      return;
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await api.post("/wallets/topup/", {
        currency,
        amount: numericAmount,
      });

      toast.success("Wallet topped up successfully");
      setAmount("");
      fetchWallets();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Top-up failed"
      );
    } finally {
      setLoading(false);
    }
  };

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
          <FiPlusCircle /> Wallet Top-Up
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Select Wallet</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {wallets.map((w) => (
              <option key={w.id} value={w.currency}>
                {w.currency}
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
            {loading ? "Processing..." : "Top-Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TopUp;
