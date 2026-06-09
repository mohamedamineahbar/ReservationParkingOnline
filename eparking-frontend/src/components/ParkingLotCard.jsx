// src/components/ParkingLotCard.jsx
import React from 'react';
import { isAdmin } from "../utils/jwtUtils.js";

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
    --green-mid:   #15803d;
    --amber:       #d97706;
    --amber-bg:    #fef3c7;
    --red:         #dc2626;
    --red-bg:      #fee2e2;
  }

  .plc-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    font-family: 'DM Sans', sans-serif;
    transition: box-shadow 0.2s, background 0.2s, transform 0.2s;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .plc-card:hover {
    box-shadow: 0 8px 28px rgba(15,45,107,0.1);
    background: var(--blue-pale);
    transform: translateY(-2px);
  }

  /* Name */
  .plc-name {
    font-family: 'Syne', sans-serif;
    font-size: clamp(15px, 2vw, 17px);
    font-weight: 700;
    color: var(--blue-deep);
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1.2;
  }
  .plc-name-icon {
    width: 32px; height: 32px;
    background: var(--blue-light);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  /* Info rows */
  .plc-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .plc-info-row {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--text-mid);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .plc-info-row strong {
    font-weight: 600;
    color: var(--text-dark);
  }

  /* Spots bar */
  .plc-spots-bar-track {
    width: 100%;
    height: 5px;
    background: var(--border);
    border-radius: 99px;
    margin-top: 4px;
    overflow: hidden;
  }
  .plc-spots-bar-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, var(--blue-bright), var(--blue-mid));
    transition: width 0.4s ease;
  }

  /* Divider */
  .plc-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 0;
  }

  /* Actions */
  .plc-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  /* Base button */
  .plc-btn {
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.03em;
    border: none;
    border-radius: 8px;
    padding: 9px 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.12s, box-shadow 0.15s, opacity 0.15s;
    white-space: nowrap;
    flex: 1;
    justify-content: center;
    min-width: 90px;
  }
  .plc-btn:hover { transform: translateY(-1px); }
  .plc-btn:active { transform: scale(0.97); }

  /* Pay Later — outlined */
  .plc-btn-outline {
    background: var(--white);
    border: 1.5px solid var(--blue-bright);
    color: var(--blue-bright);
  }
  .plc-btn-outline:hover {
    background: var(--blue-pale);
    box-shadow: 0 4px 12px rgba(45,110,245,0.15);
  }

  /* Pay Now — solid */
  .plc-btn-solid {
    background: linear-gradient(135deg, var(--green) 0%, var(--green-mid) 100%);
    color: #fff;
    box-shadow: 0 3px 10px rgba(22,163,74,0.25);
  }
  .plc-btn-solid:hover {
    box-shadow: 0 6px 18px rgba(22,163,74,0.35);
  }

  /* Edit */
  .plc-btn-edit {
    background: var(--amber-bg);
    border: 1.5px solid #fbbf24;
    color: var(--amber);
    flex: 0 0 auto;
    min-width: unset;
  }
  .plc-btn-edit:hover { background: #fde68a; }

  /* Delete */
  .plc-btn-delete {
    background: var(--red-bg);
    border: 1.5px solid #fca5a5;
    color: var(--red);
    flex: 0 0 auto;
    min-width: unset;
  }
  .plc-btn-delete:hover { background: #fecaca; }
`;

// Inject styles once
if (typeof document !== 'undefined' && !document.getElementById('plc-styles')) {
    const tag = document.createElement('style');
    tag.id = 'plc-styles';
    tag.textContent = styles;
    document.head.appendChild(tag);
}

const ParkingLotCard = ({ lot, onReserveNow, onReserveAndPay, onEdit, onDelete }) => {
    const isAdminUser = isAdmin();
    const spotsPercent = lot.totalSpots > 0
        ? Math.round((lot.availableSpots / lot.totalSpots) * 100)
        : 0;

    return (
        <div className="plc-card">

            {/* Name */}
            <div className="plc-name">
                <div className="plc-name-icon">🚗</div>
                {lot.name}
            </div>

            {/* Info */}
            <div className="plc-info">
                <div className="plc-info-row">
                    📍 <span>{lot.address}</span>
                </div>
                <div className="plc-info-row">
                    💰 <strong>{lot.pricePerHour} MAD</strong> <span style={{ color: 'var(--text-muted)' }}>/ hour</span>
                </div>
                <div className="plc-info-row">
                    🅿️ Available: <strong>{lot.availableSpots}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>/ {lot.totalSpots}</span>
                </div>
                <div className="plc-spots-bar-track">
                    <div
                        className="plc-spots-bar-fill"
                        style={{ width: `${spotsPercent}%` }}
                    />
                </div>
            </div>

            <hr className="plc-divider" />

            {/* Actions */}
            <div className="plc-actions">
                {isAdminUser && (
                    <>
                        <button className="plc-btn plc-btn-edit" onClick={onEdit} aria-label="Edit lot">
                            ✏️ Edit
                        </button>
                        <button className="plc-btn plc-btn-delete" onClick={onDelete} aria-label="Delete lot">
                            🗑 Delete
                        </button>
                    </>
                )}
                <button className="plc-btn plc-btn-outline" onClick={onReserveNow}>
                    💳 Pay Later
                </button>
                <button className="plc-btn plc-btn-solid" onClick={onReserveAndPay}>
                    ✅ Pay Now
                </button>
            </div>

        </div>
    );
};

export default ParkingLotCard;
