// src/pages/AdminPage.jsx
import axiosInstance from "../api/axios";
import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser, getAllReservations } from "../repository/adminRepository";
import { toast } from "react-toastify";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  :root {
    --blue-deep:   #0f2d6b;
    --blue-mid:    #1a4db3;
    --blue-bright: #2d6ef5;
    --blue-light:  #e8f0fe;
    --blue-pale:   #f0f5ff;
    --white:       #ffffff;
    --text-dark:   #0f2040;
    --text-mid:    #4a6080;
    --text-muted:  #8ca0bc;
    --border:      #d0ddf0;
    --surface:     #f7f9ff;
    --green:       #16a34a;
    --green-bg:    #dcfce7;
    --amber:       #d97706;
    --amber-bg:    #fef3c7;
    --red:         #dc2626;
    --red-bg:      #fee2e2;
    --radius-sm:   8px;
    --radius-md:   12px;
    --radius-lg:   16px;
    --radius-xl:   20px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .adm-root {
    min-height: 100vh;
    background: var(--surface);
    font-family: 'DM Sans', sans-serif;
    color: var(--text-dark);
  }

  /* ── Top header bar ── */
  .adm-header {
    background: linear-gradient(135deg, var(--blue-deep) 0%, var(--blue-mid) 60%, var(--blue-bright) 100%);
    padding: 0 clamp(16px, 4vw, 40px);
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 16px rgba(15,45,107,0.18);
  }
  .adm-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .adm-logo-icon {
    width: 36px; height: 36px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 800;
    color: #fff;
  }
  .adm-logo-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 17px;
    color: #fff;
  }
  .adm-header-badge {
    background: rgba(255,255,255,0.18);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 20px;
    padding: 4px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* ── Page body ── */
  .adm-body {
    padding: clamp(20px, 4vw, 40px) clamp(16px, 4vw, 40px);
    max-width: 1280px;
    margin: 0 auto;
  }

  /* ── Page title ── */
  .adm-page-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 700;
    color: var(--blue-deep);
    margin-bottom: 6px;
  }
  .adm-page-sub {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 28px;
  }

  /* ── Stats row ── */
  .adm-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 14px;
    margin-bottom: 32px;
  }
  .adm-stat-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    animation: fadeUp 0.5s ease both;
  }
  .adm-stat-card:nth-child(1) { animation-delay: 0.05s; }
  .adm-stat-card:nth-child(2) { animation-delay: 0.1s; }
  .adm-stat-card:nth-child(3) { animation-delay: 0.15s; }
  .adm-stat-card:nth-child(4) { animation-delay: 0.2s; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .adm-stat-icon {
    width: 44px; height: 44px;
    border-radius: var(--radius-md);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }
  .adm-stat-icon.blue  { background: var(--blue-light); }
  .adm-stat-icon.green { background: var(--green-bg); }
  .adm-stat-icon.amber { background: var(--amber-bg); }
  .adm-stat-icon.red   { background: var(--red-bg); }
  .adm-stat-info {}
  .adm-stat-label {
    font-size: 11px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    font-weight: 600;
    margin-bottom: 2px;
  }
  .adm-stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--text-dark);
    line-height: 1;
  }

  /* ── Content grid ── */
  .adm-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  @media (min-width: 1024px) {
    .adm-grid { grid-template-columns: 1fr 1fr; }
  }

  /* ── Section card ── */
  .adm-section {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    animation: fadeUp 0.55s ease both;
    animation-delay: 0.25s;
    display: flex;
    flex-direction: column;
  }
  .adm-section-head {
    padding: 18px 22px 14px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .adm-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--text-dark);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .adm-section-title-icon {
    font-size: 17px;
  }
  .adm-count-badge {
    background: var(--blue-light);
    color: var(--blue-mid);
    border-radius: 20px;
    padding: 2px 10px;
    font-size: 12px;
    font-weight: 600;
  }
  .adm-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--blue-pale);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 7px 12px;
    min-width: 180px;
  }
  .adm-search-icon { font-size: 14px; color: var(--text-muted); }
  .adm-search input {
    border: none;
    background: transparent;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--text-dark);
    width: 100%;
  }
  .adm-search input::placeholder { color: var(--text-muted); }

  /* ── Scrollable list ── */
  .adm-list {
    padding: 12px;
    overflow-y: auto;
    max-height: 440px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }
  .adm-list::-webkit-scrollbar { width: 5px; }
  .adm-list::-webkit-scrollbar-track { background: transparent; }
  .adm-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  /* ── User row ── */
  .adm-user-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--white);
    transition: background 0.15s, box-shadow 0.15s;
  }
  .adm-user-row:hover { background: var(--blue-pale); box-shadow: 0 2px 8px rgba(15,45,107,0.06); }
  .adm-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: var(--blue-light);
    color: var(--blue-mid);
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .adm-user-info { flex: 1; min-width: 0; }
  .adm-user-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--text-dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .adm-user-email {
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .adm-role-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .adm-role-badge.admin  { background: var(--blue-light); color: var(--blue-mid); }
  .adm-role-badge.user   { background: var(--surface);    color: var(--text-mid); border: 1px solid var(--border); }
  .adm-delete-btn {
    width: 32px; height: 32px;
    border: 1.5px solid #fca5a5;
    background: var(--red-bg);
    color: var(--red);
    border-radius: var(--radius-sm);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    transition: background 0.15s, transform 0.1s;
  }
  .adm-delete-btn:hover { background: #fecaca; transform: scale(1.08); }
  .adm-delete-btn:active { transform: scale(0.95); }

  /* ── Reservation card ── */
  .adm-res-card {
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--white);
    transition: background 0.15s, box-shadow 0.15s;
  }
  .adm-res-card:hover { background: var(--blue-pale); box-shadow: 0 2px 8px rgba(15,45,107,0.06); }
  .adm-res-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }
  .adm-res-user {
    font-weight: 600;
    font-size: 14px;
    color: var(--text-dark);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .adm-res-user-icon { font-size: 13px; }
  .adm-status-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    white-space: nowrap;
  }
  .adm-status-badge.active   { background: var(--green-bg);  color: var(--green); }
  .adm-status-badge.pending  { background: var(--amber-bg);  color: var(--amber); }
  .adm-status-badge.complete { background: var(--blue-light); color: var(--blue-mid); }
  .adm-res-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 6px 16px;
  }
  .adm-res-detail {
    font-size: 12px;
    color: var(--text-mid);
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .adm-res-detail strong {
    color: var(--text-dark);
    font-weight: 600;
  }

  /* ── Empty state ── */
  .adm-empty {
    padding: 40px 20px;
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
  }
  .adm-empty-icon { font-size: 32px; margin-bottom: 8px; }

  /* ── Confirm modal ── */
  .adm-overlay {
    position: fixed; inset: 0;
    background: rgba(15,45,107,0.35);
    display: flex; align-items: center; justify-content: center;
    z-index: 200;
    padding: 16px;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .adm-modal {
    background: var(--white);
    border-radius: var(--radius-xl);
    padding: 28px 28px 24px;
    max-width: 360px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(15,45,107,0.2);
    animation: popUp 0.2s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes popUp {
    from { opacity: 0; transform: scale(0.92) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .adm-modal-icon {
    width: 48px; height: 48px;
    background: var(--red-bg);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    margin-bottom: 16px;
  }
  .adm-modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 8px;
  }
  .adm-modal-desc {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 22px;
  }
  .adm-modal-actions {
    display: flex;
    gap: 10px;
  }
  .adm-modal-cancel {
    flex: 1;
    padding: 11px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--white);
    color: var(--text-mid);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .adm-modal-cancel:hover { background: var(--surface); }
  .adm-modal-confirm {
    flex: 1;
    padding: 11px;
    border: none;
    border-radius: var(--radius-md);
    background: var(--red);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
  }
  .adm-modal-confirm:hover { background: #b91c1c; }
  .adm-modal-confirm:active { transform: scale(0.97); }
`;

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [userSearch, setUserSearch] = useState("");
    const [resSearch, setResSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        loadUsers();
        loadReservations();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch {
            toast.error("Failed to load users.");
        }
    };

    const loadReservations = async () => {
        try {
            const data = await getAllReservations();
            setReservations(data);
        } catch {
            toast.error("Failed to load reservations.");
        }
    };

    const handleDeleteUser = async (username) => {
        try {
            await axiosInstance.delete(`/admin/users/${username}`);
            setUsers((prev) => prev.filter((u) => u.username !== username));
            setDeleteTarget(null);
            toast.success("User deleted.");
            await loadReservations();
        } catch {
            toast.error("Failed to delete user.");
            setDeleteTarget(null);
        }
    };

    /* Filtered lists */
    const filteredUsers = users.filter(
        (u) =>
            u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(userSearch.toLowerCase())
    );
    const filteredReservations = reservations.filter(
        (r) =>
            (r.user?.username || "").toLowerCase().includes(resSearch.toLowerCase()) ||
            (r.parkingLot?.name || "").toLowerCase().includes(resSearch.toLowerCase())
    );

    /* Stats */
    const totalUsers = users.length;
    const totalReservations = reservations.length;
    const activeReservations = reservations.filter(
        (r) => r.checkedInAt && !r.checkedOutAt
    ).length;
    const adminCount = users.filter((u) => u.role === "ROLE_ADMIN").length;

    const getInitials = (username) =>
        username ? username.slice(0, 2).toUpperCase() : "??";

    const getReservationStatus = (r) => {
        if (r.checkedInAt && r.checkedOutAt) return "complete";
        if (r.checkedInAt) return "active";
        return "pending";
    };
    const getReservationStatusLabel = (status) => {
        if (status === "complete") return "Completed";
        if (status === "active") return "Active";
        return "Pending";
    };

    return (
        <>
            <style>{styles}</style>
            <div className="adm-root">

                {/* ── Header ── */}
                <header className="adm-header">
                    <div className="adm-header-left">
                        <div className="adm-logo-icon">e</div>
                        <span className="adm-logo-name">eParking Bitola</span>
                    </div>
                    <span className="adm-header-badge">Admin Panel</span>
                </header>

                {/* ── Body ── */}
                <main className="adm-body">
                    <h1 className="adm-page-title">Dashboard</h1>
                    <p className="adm-page-sub">Manage users, reservations, and system overview.</p>

                    {/* ── Stats ── */}
                    <div className="adm-stats">
                        <div className="adm-stat-card">
                            <div className="adm-stat-icon blue">👥</div>
                            <div className="adm-stat-info">
                                <div className="adm-stat-label">Total Users</div>
                                <div className="adm-stat-value">{totalUsers}</div>
                            </div>
                        </div>
                        <div className="adm-stat-card">
                            <div className="adm-stat-icon green">🅿️</div>
                            <div className="adm-stat-info">
                                <div className="adm-stat-label">Reservations</div>
                                <div className="adm-stat-value">{totalReservations}</div>
                            </div>
                        </div>
                        <div className="adm-stat-card">
                            <div className="adm-stat-icon amber">⚡</div>
                            <div className="adm-stat-info">
                                <div className="adm-stat-label">Active Now</div>
                                <div className="adm-stat-value">{activeReservations}</div>
                            </div>
                        </div>
                        <div className="adm-stat-card">
                            <div className="adm-stat-icon red">🛡️</div>
                            <div className="adm-stat-info">
                                <div className="adm-stat-label">Admins</div>
                                <div className="adm-stat-value">{adminCount}</div>
                            </div>
                        </div>
                    </div>

                    {/* ── Grid: Users + Reservations ── */}
                    <div className="adm-grid">

                        {/* Users section */}
                        <section className="adm-section">
                            <div className="adm-section-head">
                                <div className="adm-section-title">
                                    <span className="adm-section-title-icon">👥</span>
                                    Users
                                    <span className="adm-count-badge">{filteredUsers.length}</span>
                                </div>
                                <div className="adm-search">
                                    <span className="adm-search-icon">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Search users…"
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="adm-list">
                                {filteredUsers.length === 0 ? (
                                    <div className="adm-empty">
                                        <div className="adm-empty-icon">👤</div>
                                        No users found.
                                    </div>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <div key={user.username} className="adm-user-row">
                                            <div className="adm-avatar">{getInitials(user.username)}</div>
                                            <div className="adm-user-info">
                                                <div className="adm-user-name">{user.username}</div>
                                                <div className="adm-user-email">{user.email}</div>
                                            </div>
                                            <span className={`adm-role-badge ${user.role === "ROLE_ADMIN" ? "admin" : "user"}`}>
                                                {user.role === "ROLE_ADMIN" ? "Admin" : "User"}
                                            </span>
                                            <button
                                                className="adm-delete-btn"
                                                onClick={() => setDeleteTarget(user)}
                                                aria-label={`Delete user ${user.username}`}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Reservations section */}
                        <section className="adm-section">
                            <div className="adm-section-head">
                                <div className="adm-section-title">
                                    <span className="adm-section-title-icon">🅿️</span>
                                    Reservations
                                    <span className="adm-count-badge">{filteredReservations.length}</span>
                                </div>
                                <div className="adm-search">
                                    <span className="adm-search-icon">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Search reservations…"
                                        value={resSearch}
                                        onChange={(e) => setResSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="adm-list">
                                {filteredReservations.length === 0 ? (
                                    <div className="adm-empty">
                                        <div className="adm-empty-icon">📋</div>
                                        No reservations found.
                                    </div>
                                ) : (
                                    filteredReservations.map((r) => {
                                        const status = getReservationStatus(r);
                                        return (
                                            <div key={r.id} className="adm-res-card">
                                                <div className="adm-res-top">
                                                    <span className="adm-res-user">
                                                        <span className="adm-res-user-icon">👤</span>
                                                        {r.user?.username || "N/A"}
                                                    </span>
                                                    <span className={`adm-status-badge ${status}`}>
                                                        {getReservationStatusLabel(status)}
                                                    </span>
                                                </div>
                                                <div className="adm-res-details">
                                                    <span className="adm-res-detail">
                                                        <strong>Lot:</strong> {r.parkingLot?.name || "N/A"}
                                                    </span>
                                                    <span className="adm-res-detail">
                                                        <strong>Duration:</strong> {r.durationInMinutes} min
                                                    </span>
                                                    <span className="adm-res-detail">
                                                        <strong>Type:</strong> {r.type || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </section>
                    </div>
                </main>

                {/* ── Delete confirmation modal ── */}
                {deleteTarget && (
                    <div className="adm-overlay" onClick={() => setDeleteTarget(null)}>
                        <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="adm-modal-icon">🗑️</div>
                            <h3 className="adm-modal-title">Delete User</h3>
                            <p className="adm-modal-desc">
                                Are you sure you want to delete <strong>{deleteTarget.username}</strong>?
                                This action cannot be undone and will remove all their reservations.
                            </p>
                            <div className="adm-modal-actions">
                                <button
                                    className="adm-modal-cancel"
                                    onClick={() => setDeleteTarget(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="adm-modal-confirm"
                                    onClick={() => handleDeleteUser(deleteTarget.username)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
