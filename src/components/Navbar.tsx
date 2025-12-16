import React from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

const Navbar = (): React.JSX.Element => {
  const { user } = useUser();
  const clerk = useClerk();

  return (
    <nav className="navbar">
      <div className="noise-overlay"></div>
      <div className="scan-line"></div>
      <div className="navbar-container">
        <div className="logo-section">
          <div className="logo-frame">
            <span className="logo-bracket">[</span>
            <h1 className="logo">
              <span className="logo-icon">♪</span>
              <span className="logo-text">
                SOUND<span className="logo-dot">.</span>SYSTEM
              </span>
            </h1>
            <span className="logo-bracket">]</span>
          </div>
          <div className="logo-subtitle">
            <span className="subtitle-line"></span>
            Audio Distribution Platform
            <span className="subtitle-pulse">●</span>
          </div>
        </div>

        {user && (
          <div className="user-section">
            <div className="user-badge">
              <div className="badge-corner tl"></div>
              <div className="badge-corner br"></div>
              <div className="badge-label">
                <span className="label-icon">▸</span>
                ACTIVE USER
                <span className="status-indicator"></span>
              </div>
              <div className="user-details">
                <div className="user-avatar">
                  {user.imageUrl ? (
                    <img src={user.imageUrl} alt="Profile" />
                  ) : (
                    <span>
                      {(
                        user.firstName?.[0] ||
                        user.username?.[0] ||
                        "U"
                      ).toUpperCase()}
                    </span>
                  )}
                  <div className="avatar-glitch"></div>
                </div>
                <div className="user-text">
                  <span className="user-name">
                    {user.firstName || user.username}
                  </span>
                  <span className="user-id">
                    <span className="id-label">ID:</span>
                    {user.id.slice(0, 8)}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => clerk.signOut()} className="sign-out-btn">
              <span className="btn-bg"></span>
              <span className="btn-text">DISCONNECT</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Bebas+Neue&family=Rajdhani:wght@300;400;600;700&display=swap');

        :root {
          --primary: #ff6b35;
          --secondary: #f7931e;
          --dark: #1a1a1a;
          --dark-elevated: #2c2b2b;
          --light: #f5f5f5;
          --accent: #00ff88;
          --accent-glow: rgba(0, 255, 136, 0.5);
        }

        * {
          box-sizing: border-box;
        }

        .navbar {
          position: relative;
          width: 100%;
          background: linear-gradient(180deg, var(--dark) 0%, var(--dark-elevated) 100%);
          border-bottom: 4px solid var(--primary);
          box-shadow: 
            0 8px 0 rgba(255, 107, 53, 0.2),
            0 12px 32px rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }

        .noise-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.5;
          mix-blend-mode: overlay;
        }

        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            var(--accent) 50%, 
            transparent 100%);
          animation: scan 3s linear infinite;
          opacity: 0.3;
          filter: blur(1px);
        }

        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100px); }
        }

        .navbar-container {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1;
        }

        .logo-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .logo-frame {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          filter: drop-shadow(0 0 20px rgba(255, 107, 53, 0.3));
        }

        .logo-bracket {
          font-family: sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
          animation: blink 2s step-end infinite;
          text-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
        }

        @keyframes blink {
          0%, 45%, 55%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .logo {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: sans-serif;
          font-size: 2rem;
          letter-spacing: 0.1em;
          line-height: 1;
        }

        .logo-icon {
          font-size: 2rem;
          color: var(--accent);
          font-weight: 700;
          animation: float 3s ease-in-out infinite;
          filter: drop-shadow(0 0 10px var(--accent-glow));
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .logo-text {
          color: var(--light);
          font-weight: 400;
          text-transform: uppercase;
          position: relative;
        }

        .logo-text::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--primary) 0%, transparent 100%);
          animation: slide 2s ease-in-out infinite;
        }

        @keyframes slide {
          0%, 100% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
        }

        .logo-dot {
          color: var(--primary);
          font-size: 2.5rem;
          animation: pulse-dot 1.5s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes pulse-dot {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1;
            filter: drop-shadow(0 0 5px var(--primary));
          }
          50% { 
            transform: scale(1.3); 
            opacity: 0.7;
            filter: drop-shadow(0 0 15px var(--primary));
          }
        }

        .logo-subtitle {
          font-family: sans-serif;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-left: 3rem;
          padding-left: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          position: relative;
        }

        .subtitle-line {
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, var(--secondary) 0%, transparent 100%);
          display: inline-block;
        }

        .subtitle-pulse {
          color: var(--accent);
          font-size: 0.6rem;
          animation: pulse-indicator 2s ease-in-out infinite;
        }

        @keyframes pulse-indicator {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-badge {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 107, 53, 0.05);
          border: 2px solid var(--primary);
          position: relative;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
          transition: all 0.3s ease;
        }

        .user-badge:hover {
          background: rgba(255, 107, 53, 0.1);
          box-shadow: 0 0 20px rgba(255, 107, 53, 0.2);
        }

        .badge-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--accent);
        }

        .badge-corner.tl {
          top: -2px;
          left: -2px;
          border-right: none;
          border-bottom: none;
          animation: corner-pulse 2s ease-in-out infinite;
        }

        .badge-corner.br {
          bottom: -2px;
          right: -2px;
          border-left: none;
          border-top: none;
          animation: corner-pulse 2s ease-in-out infinite 1s;
        }

        @keyframes corner-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .badge-label {
          font-family: sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .label-icon {
          color: var(--accent);
          font-size: 0.8rem;
          animation: blink-icon 1.5s step-end infinite;
        }

        @keyframes blink-icon {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .status-indicator {
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--accent-glow);
          animation: pulse-indicator 2s ease-in-out infinite;
        }

        .user-details {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          font-weight: 700;
          color: var(--dark);
          font-size: 1.3rem;
          overflow: hidden;
          clip-path: polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%);
          position: relative;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          transition: all 0.3s ease;
        }

        .user-avatar:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }

        .avatar-glitch {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(0, 255, 136, 0.1) 100%);
          animation: glitch 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes glitch {
          0%, 90%, 100% { opacity: 0; }
          91%, 94% { opacity: 1; transform: translateX(2px); }
          92%, 93% { opacity: 1; transform: translateX(-2px); }
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .user-name {
          font-family: sans-serif;
          font-weight: 400;
          color: var(--light);
          font-size: 1.15rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .user-id {
          font-family: sans-serif;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .id-label {
          color: var(--secondary);
          font-weight: 700;
        }

        .sign-out-btn {
          position: relative;
          padding: 0.85rem 2rem;
          background: transparent;
          border: 3px solid var(--light);
          color: var(--light);
          font-family: sans-serif;
          font-size: 1.15rem;
          letter-spacing: 0.12em;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          overflow: hidden;
          text-transform: uppercase;
          clip-path: polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%);
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .btn-bg {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--light) 0%, #e0e0e0 100%);
          transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }

        .btn-text {
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .btn-arrow {
          font-size: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .sign-out-btn:hover {
          color: var(--dark);
          border-color: var(--light);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 245, 245, 0.2);
        }

        .sign-out-btn:hover .btn-bg {
          left: 0;
        }

        .sign-out-btn:hover .btn-arrow {
          transform: translateX(8px) scale(1.1);
        }

        .sign-out-btn:active {
          transform: translateY(0) scale(0.98);
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .navbar-container {
            padding: 1.25rem 1.5rem;
          }

          .logo {
            font-size: 1.75rem;
          }

          .logo-bracket {
            font-size: 2.25rem;
          }

          .user-section {
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 1rem;
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-start;
          }

          .logo {
            font-size: 1.5rem;
          }

          .logo-bracket {
            font-size: 2rem;
          }

          .logo-subtitle {
            font-size: 0.6rem;
            margin-left: 2rem;
            padding-left: 0.75rem;
          }

          .subtitle-line {
            width: 30px;
          }

          .user-section {
            width: 100%;
            justify-content: space-between;
          }

          .user-badge {
            padding: 0.6rem 1rem;
          }

          .badge-label {
            font-size: 0.6rem;
          }

          .user-avatar {
            width: 38px;
            height: 38px;
            font-size: 1.15rem;
          }

          .user-name {
            font-size: 1rem;
          }

          .user-id {
            font-size: 0.65rem;
          }

          .sign-out-btn {
            padding: 0.7rem 1.5rem;
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .logo-subtitle {
            display: none;
          }

          .user-badge {
            padding: 0.5rem 0.75rem;
          }

          .badge-label {
            font-size: 0.55rem;
          }

          .user-avatar {
            width: 35px;
            height: 35px;
          }

          .user-text {
            display: none;
          }

          .sign-out-btn {
            padding: 0.6rem 1.25rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;