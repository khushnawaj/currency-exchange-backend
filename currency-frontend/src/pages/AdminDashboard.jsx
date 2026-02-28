import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
    FiUsers,
    FiActivity,
    FiDollarSign,
    FiShield,
    FiArrowUpRight,
    FiCheckCircle,
    FiXCircle,
    FiRefreshCw
} from "react-icons/fi";
import "../index.css";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, txRes] = await Promise.all([
                api.get("/admin-ui/stats/"),
                api.get("/admin-ui/users/"),
                api.get("/admin-ui/transactions/")
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setTransactions(txRes.data);
        } catch (err) {
            toast.error("Failed to fetch admin data");
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId) => {
        try {
            const res = await api.post(`/admin-ui/users/${userId}/toggle-status/`);
            toast.success(res.data.message);
            setUsers(users.map(u => u.id === userId ? { ...u, is_active: res.data.is_active } : u));
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update user status");
        }
    };

    if (loading) return <div className="loading">Loading Admin Panel...</div>;

    return (
        <div className="dashboard-container admin-panel">
            <header className="admin-header">
                <div>
                    <h1>Admin Command Center</h1>
                    <p>Global Platform Overview & Management</p>
                </div>
                <button className="refresh-btn" onClick={fetchData}>
                    <FiRefreshCw /> Refresh Data
                </button>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon users"><FiUsers /></div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p className="stat-value">{stats?.total_users}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon volume"><FiActivity /></div>
                    <div className="stat-info">
                        <h3>Total Volume</h3>
                        <p className="stat-value">${stats?.total_volume}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon txs"><FiArrowUpRight /></div>
                    <div className="stat-info">
                        <h3>Total TXs</h3>
                        <p className="stat-value">{stats?.total_transactions}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon shield"><FiShield /></div>
                    <div className="stat-info">
                        <h3>Active Currencies</h3>
                        <p className="stat-value">{stats?.active_currencies}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={activeTab === "overview" ? "active" : ""}
                    onClick={() => setActiveTab("overview")}
                >
                    Wallet Balances
                </button>
                <button
                    className={activeTab === "users" ? "active" : ""}
                    onClick={() => setActiveTab("users")}
                >
                    User Management
                </button>
                <button
                    className={activeTab === "txs" ? "active" : ""}
                    onClick={() => setActiveTab("txs")}
                >
                    All Transactions
                </button>
            </div>

            <main className="admin-content">
                {activeTab === "overview" && (
                    <div className="table-card fadeIn">
                        <h2>Platform Liquidity</h2>
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Currency</th>
                                        <th>Total Balance</th>
                                        <th>Number of Wallets</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.wallets_summary.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="currency-code">{item.currency}</td>
                                            <td className="balance">{item.total_balance.toLocaleString()}</td>
                                            <td>{item.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "users" && (
                    <div className="table-card fadeIn">
                        <h2>System Users</h2>
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Joined</th>
                                        <th>Status</th>
                                        <th>Roles</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.email}>
                                            <td>
                                                <div className="user-cell">
                                                    <img src={user.profile_photo_url || "https://ui-avatars.com/api/?name=" + user.full_name} alt="" />
                                                    <div>
                                                        <p className="name">{user.full_name}</p>
                                                        <p className="email">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${user.is_active ? "success" : "danger"}`}>
                                                    {user.is_active ? "Active" : "Disabled"}
                                                </span>
                                            </td>
                                            <td>
                                                {user.is_staff && <span className="role-badge staff">Staff</span>}
                                                {user.is_superuser && <span className="role-badge admin">Admin</span>}
                                                {!user.is_staff && !user.is_superuser && <span className="role-badge user">User</span>}
                                            </td>
                                            <td>
                                                <button
                                                    className={`action-btn ${user.is_active ? "disable" : "enable"}`}
                                                    onClick={() => toggleUserStatus(user.id)}
                                                >
                                                    {user.is_active ? <FiXCircle /> : <FiCheckCircle />}
                                                    {user.is_active ? "Disable" : "Enable"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "txs" && (
                    <div className="table-card fadeIn">
                        <h2>Global Transaction Stream</h2>
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Sender</th>
                                        <th>Receiver</th>
                                        <th>Amount sent</th>
                                        <th>Amount received</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id}>
                                            <td>{new Date(tx.created_at).toLocaleString()}</td>
                                            <td>{tx.sender_email}</td>
                                            <td>{tx.receiver_email}</td>
                                            <td className="amt sent">{tx.amount_sent} {tx.from_currency}</td>
                                            <td className="amt rec">{tx.amount_received} {tx.to_currency}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
        .admin-panel { padding: 40px; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .admin-header h1 { color: #fff; font-size: 2.5rem; margin-bottom: 5px; }
        .admin-header p { color: #888; }
        .refresh-btn { background: #333; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.3s; }
        .refresh-btn:hover { background: #444; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; display: flex; align-items: center; gap: 15px; border: 1px solid rgba(255,255,255,0.1); }
        .stat-icon { font-size: 1.5rem; padding: 12px; border-radius: 10px; display: flex; }
        .stat-icon.users { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .stat-icon.volume { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .stat-icon.txs { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .stat-icon.shield { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
        .stat-info h3 { font-size: 0.9rem; color: #888; margin-bottom: 5px; }
        .stat-value { font-size: 1.5rem; color: #fff; font-weight: 700; }

        .admin-tabs { display: flex; gap: 20px; border-bottom: 1px solid #333; margin-bottom: 30px; }
        .admin-tabs button { background: none; border: none; color: #888; padding: 12px 5px; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; transition: 0.3s; }
        .admin-tabs button.active { color: #3b82f6; border-bottom-color: #3b82f6; }

        .table-card { background: rgba(255,255,255,0.03); border-radius: 16px; padding: 25px; border: 1px solid #222; }
        .table-card h2 { color: #fff; margin-bottom: 20px; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 15px; color: #666; font-size: 0.85rem; text-transform: uppercase; border-bottom: 1px solid #222; }
        .admin-table td { padding: 15px; color: #ddd; vertical-align: middle; }
        .admin-table tr:hover { background: rgba(255,255,255,0.02); }

        .user-cell { display: flex; align-items: center; gap: 12px; }
        .user-cell img { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #333; }
        .user-cell .name { font-weight: 600; color: #fff; display: block; }
        .user-cell .email { font-size: 0.8rem; color: #888; }

        .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
        .badge.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .badge.danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .role-badge { font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; border: 1px solid; margin-right: 5px; }
        .role-badge.admin { border-color: #ef4444; color: #ef4444; background: rgba(239,68,68,0.05); }
        .role-badge.staff { border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,0.05); }
        .role-badge.user { border-color: #666; color: #666; }

        .action-btn { background: none; border: 1px solid #333; padding: 8px 15px; border-radius: 8px; color: #fff; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.3s; }
        .action-btn.disable:hover { border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.05); }
        .action-btn.enable:hover { border-color: #10b981; color: #10b981; background: rgba(16, 185, 129, 0.05); }

        .amt.sent { color: #f87171; }
        .amt.rec { color: #4ade80; }
        
        .currency-code { font-weight: 800; color: #3b82f6; }
        .balance { font-family: 'Courier New', monospace; font-weight: 600; }

        .fadeIn { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    );
}

export default AdminDashboard;
