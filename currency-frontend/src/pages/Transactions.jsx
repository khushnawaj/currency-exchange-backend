import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  FiArrowUpRight,
  FiArrowDownLeft,
  FiClock,
} from "react-icons/fi";
import { logout } from "../utils/auth";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.type) queryParams.append('type', params.type);
      if (params.start_date) queryParams.append('start_date', params.start_date);
      if (params.end_date) queryParams.append('end_date', params.end_date);

      const url = `/transactions/?${queryParams.toString()}`;
      const res = await api.get(url);
      setTransactions(res.data || []);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
      } else {
        toast.error(
          err.response?.data?.error || "Failed to load transactions"
        );
      }
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (filterType) queryParams.append('type', filterType);
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);

      const url = `/transactions/export/?${queryParams.toString()}`;
      const res = await api.get(url, { responseType: 'blob' });

      const blob = new Blob([res.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'transactions.csv';
      link.click();

      toast.success("Transactions exported successfully!");
    } catch (err) {
      toast.error("Failed to export transactions");
    }
  };

  const handleSearch = () => {
    fetchTransactions({
      search: searchTerm,
      type: filterType,
      start_date: startDate,
      end_date: endDate,
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="page-title">Transaction History</h2>

      <div className="filters-section">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search by email or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="sent">Sent</option>
            <option value="received">Received</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
          <button onClick={handleSearch} className="btn-primary">
            Search
          </button>
          <button onClick={handleExport} className="btn-secondary">
            Export CSV
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <div className="transaction-list">
          {transactions.map((tx) => {
            const isSent = tx.type === "sent";

            return (
              <div className="transaction-card" key={tx.id}>
                <div
                  className={`tx-icon ${
                    isSent ? "tx-sent" : "tx-received"
                  }`}
                >
                  {isSent ? (
                    <FiArrowUpRight />
                  ) : (
                    <FiArrowDownLeft />
                  )}
                </div>

                <div className="tx-info">
                  <div className="tx-main">
                    <strong>
                      {isSent ? "Sent" : "Received"}
                    </strong>
                    <span>
                      {isSent ? tx.amount_sent : tx.amount_received} {isSent ? tx.from_currency : tx.to_currency}
                    </span>
                  </div>

                  <div className="tx-sub">
                    {isSent ? (
                      <>To: {tx.receiver_email}</>
                    ) : (
                      <>From: {tx.sender_email}</>
                    )}
                  </div>

                  <div className="tx-time">
                    <FiClock />
                    <span>
                      {tx.created_at
                        ? new Date(tx.created_at).toLocaleString()
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Transactions;
