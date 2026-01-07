import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";
import { useUser } from "@clerk/clerk-react";

interface Track {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  createdAt: any;
}

const MusicList = (): React.JSX.Element => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { user } = useUser();

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "tracks"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Track, 'id'>),
      }));
      setTracks(data);
    } catch (err) {
      console.error("Error fetching tracks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const handleDelete = async (track: Track) => {
    if (!user || user.id !== track.uploadedBy) {
      alert("You can only delete your own tracks!");
      return;
    }

    if (!window.confirm(`Delete "${track.name}"?`)) return;

    try {
      await deleteDoc(doc(db, "tracks", track.id));
      const storageRef = ref(storage, `music/${track.uploadedBy}/${track.name}`);
      await deleteObject(storageRef);
      alert("Track deleted successfully!");
      fetchTracks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete track.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "RECENT";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}MIN AGO`;
    if (diffHours < 24) return `${diffHours}HR AGO`;
    if (diffDays < 7) return `${diffDays}D AGO`;
    return date.toLocaleDateString().toUpperCase();
  };

  const getTrackNumber = (index: number) => {
    return String(index + 1).padStart(2, "0");
  };

  if (loading) {
    return (
      <div className="music-container">
        <div className="loading-container">
          <div className="vinyl-loader">
            <div className="vinyl-disc">
              <div className="vinyl-center"></div>
              <div className="vinyl-groove"></div>
              <div className="vinyl-groove"></div>
              <div className="vinyl-groove"></div>
            </div>
          </div>
          <p className="loading-text">
            <span className="loading-bracket">[</span>
            LOADING TRACKS
            <span className="loading-dots">...</span>
            <span className="loading-bracket">]</span>
          </p>
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

          .music-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
            min-height: 100vh;
            background: var(--dark);
            position: relative;
          }

          .music-container::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
            pointer-events: none;
            opacity: 0.3;
            z-index: 0;
          }

          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            gap: 2rem;
            position: relative;
            z-index: 1;
          }

          .vinyl-loader {
            position: relative;
            width: 120px;
            height: 120px;
          }

          .vinyl-disc {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #2c2b2b 0%, #1a1a1a 100%);
            border-radius: 50%;
            position: relative;
            animation: spin 2s linear infinite;
            box-shadow: 
              0 0 0 3px var(--primary),
              0 0 20px rgba(255, 107, 53, 0.5),
              inset 0 0 30px rgba(0, 0, 0, 0.8);
          }

          .vinyl-center {
            position: absolute;
            width: 30%;
            height: 30%;
            background: var(--primary);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 15px rgba(255, 107, 53, 0.8);
          }

          .vinyl-center::after {
            content: '';
            position: absolute;
            width: 40%;
            height: 40%;
            background: var(--dark);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .vinyl-groove {
            position: absolute;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .vinyl-groove:nth-child(2) {
            width: 60%;
            height: 60%;
          }

          .vinyl-groove:nth-child(3) {
            width: 75%;
            height: 75%;
          }

          .vinyl-groove:nth-child(4) {
            width: 90%;
            height: 90%;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .loading-text {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.5rem;
            color: var(--light);
            letter-spacing: 0.15em;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .loading-bracket {
            color: var(--primary);
            font-size: 2rem;
            animation: blink 1s step-end infinite;
          }

          .loading-dots {
            animation: dots 1.5s steps(4, end) infinite;
          }

          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }

          @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="music-container">
      <div className="header-section">
        <div className="header-frame">
          <div className="corner-accent tl"></div>
          <div className="corner-accent br"></div>
          <h2 className="library-title">
            <span className="title-bracket">[</span>
            <span className="title-icon">♪</span>
            MUSIC LIBRARY
            <span className="title-bracket">]</span>
          </h2>
          <div className="track-counter">
            <span className="counter-label">TOTAL TRACKS:</span>
            <span className="counter-number">{String(tracks.length).padStart(3, "0")}</span>
            <span className="counter-pulse">●</span>
          </div>
        </div>
      </div>

      {tracks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-vinyl">
            <div className="vinyl-disc-empty">
              <div className="vinyl-center"></div>
              <div className="vinyl-groove"></div>
              <div className="vinyl-groove"></div>
              <div className="vinyl-groove"></div>
            </div>
          </div>
          <h3 className="empty-title">
            <span className="empty-bracket">[</span>
            NO TRACKS FOUND
            <span className="empty-bracket">]</span>
          </h3>
          <p className="empty-text">
            Upload your first track to start building your library
          </p>
          <div className="empty-scan-line"></div>
        </div>
      ) : (
        <div className="track-grid">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className={`track-card ${playingId === track.id ? "playing" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-corner tl"></div>
              <div className="card-corner br"></div>
              
              <div className="track-header">
                <div className="track-number-section">
                  <span className="track-bracket">[</span>
                  <span className="track-number">{getTrackNumber(index)}</span>
                  <span className="track-bracket">]</span>
                </div>
                
                {user && user.id === track.uploadedBy && (
                  <button
                    onClick={() => handleDelete(track)}
                    className="delete-btn"
                    title="Delete track"
                  >
                    <span className="btn-icon">×</span>
                  </button>
                )}
              </div>

              <div className="track-body">
                <div className="vinyl-mini">
                  {playingId === track.id ? (
                    <div className="vinyl-spinning">
                      <div className="mini-disc"></div>
                    </div>
                  ) : (
                    <div className="vinyl-static">
                      <div className="mini-disc"></div>
                    </div>
                  )}
                </div>

                <div className="track-details">
                  <h3 className="track-title">
                    {track.name.replace(/\.[^/.]+$/, "")}
                  </h3>
                  <div className="track-meta">
                    <span className="meta-label">UPLOADED:</span>
                    <span className="meta-value">{formatDate(track.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="audio-section">
                <audio
                  controls
                  src={track.url}
                  className="audio-player"
                  onPlay={() => setPlayingId(track.id)}
                  onPause={() => setPlayingId(null)}
                  onEnded={() => setPlayingId(null)}
                ></audio>
              </div>

              {playingId === track.id && (
                <div className="now-playing-bar">
                  <div className="wave-group">
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                  </div>
                  <span className="playing-text">NOW PLAYING</span>
                  <div className="playing-pulse">●</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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

        .music-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          background: var(--dark);
          position: relative;
        }

        .music-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.3;
          z-index: 0;
        }

        .header-section {
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
          animation: slideDown 0.6s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header-frame {
          background: linear-gradient(135deg, var(--dark-elevated) 0%, var(--dark) 100%);
          border: 3px solid var(--primary);
          padding: 2rem;
          position: relative;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
          box-shadow: 
            0 0 0 1px rgba(255, 107, 53, 0.3),
            0 10px 40px rgba(0, 0, 0, 0.6);
        }

        .corner-accent {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 3px solid var(--accent);
        }

        .corner-accent.tl {
          top: -3px;
          left: -3px;
          border-right: none;
          border-bottom: none;
          animation: corner-glow 2s ease-in-out infinite;
        }

        .corner-accent.br {
          bottom: -3px;
          right: -3px;
          border-left: none;
          border-top: none;
          animation: corner-glow 2s ease-in-out infinite 1s;
        }

        @keyframes corner-glow {
          0%, 100% { 
            opacity: 0.5;
            box-shadow: 0 0 0 var(--accent);
          }
          50% { 
            opacity: 1;
            box-shadow: 0 0 15px var(--accent-glow);
          }
        }

        .library-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3.5rem;
          letter-spacing: 0.15em;
          color: var(--light);
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 1rem;
          text-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
        }

        .title-bracket {
          color: var(--primary);
          font-size: 4rem;
          animation: blink 2s step-end infinite;
        }

        .title-icon {
          color: var(--accent);
          font-size: 3rem;
          animation: float 3s ease-in-out infinite;
          filter: drop-shadow(0 0 10px var(--accent-glow));
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }

        .track-counter {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 107, 53, 0.1);
          border: 2px solid var(--primary);
          width: fit-content;
          clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%);
        }

        .counter-label {
          color: var(--secondary);
        }

        .counter-number {
          color: var(--light);
          font-size: 1.2rem;
        }

        .counter-pulse {
          color: var(--accent);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .empty-state {
          background: linear-gradient(135deg, var(--dark-elevated) 0%, var(--dark) 100%);
          border: 3px dashed var(--primary);
          padding: 4rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          animation: fadeIn 0.6s ease-out;
          z-index: 1;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .empty-vinyl {
          width: 150px;
          height: 150px;
          margin: 0 auto 2rem;
        }

        .vinyl-disc-empty {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%);
          border-radius: 50%;
          position: relative;
          box-shadow: 
            0 0 0 3px rgba(255, 107, 53, 0.3),
            inset 0 0 30px rgba(0, 0, 0, 0.8);
        }

        .empty-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.5rem;
          letter-spacing: 0.15em;
          color: var(--light);
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .empty-bracket {
          color: var(--primary);
          font-size: 3rem;
        }

        .empty-text {
          font-family: 'Rajdhani', sans-serif;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .empty-scan-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
          animation: scan 3s linear infinite;
        }

        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .track-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          position: relative;
          z-index: 1;
        }

        .track-card {
          background: linear-gradient(135deg, var(--dark-elevated) 0%, var(--dark) 100%);
          border: 2px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          position: relative;
          transition: all 0.3s ease;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
          animation: cardAppear 0.6s ease-out backwards;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .track-card:hover {
          border-color: var(--primary);
          box-shadow: 
            0 0 0 1px var(--primary),
            0 8px 30px rgba(255, 107, 53, 0.3);
          transform: translateY(-5px);
        }

        .track-card.playing {
          border-color: var(--accent);
          background: linear-gradient(135deg, var(--dark-elevated) 0%, #1a2a1a 100%);
          box-shadow: 
            0 0 0 2px var(--accent),
            0 10px 40px rgba(0, 255, 136, 0.3);
        }

        .card-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--secondary);
          z-index: 2;
        }

        .card-corner.tl {
          top: -2px;
          left: -2px;
          border-right: none;
          border-bottom: none;
        }

        .card-corner.br {
          bottom: -2px;
          right: -2px;
          border-left: none;
          border-top: none;
        }

        .track-card.playing .card-corner {
          border-color: var(--accent);
          animation: corner-pulse 1s ease-in-out infinite;
        }

        @keyframes corner-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* TRACK HEADER */
        .track-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .track-number-section {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          color: var(--light);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .track-bracket {
          color: var(--primary);
          font-size: 2.5rem;
        }

        .track-number {
          color: var(--light);
          text-shadow: 0 0 10px rgba(255, 107, 53, 0.3);
        }

        .delete-btn {
          width: 40px;
          height: 40px;
          background: rgba(255, 107, 53, 0.2);
          border: 2px solid var(--primary);
          color: var(--primary);
          font-size: 2rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%);
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          line-height: 1;
        }

        .delete-btn:hover {
          background: var(--primary);
          color: var(--dark);
          transform: scale(1.1) rotate(90deg);
          box-shadow: 0 0 15px rgba(255, 107, 53, 0.5);
        }
        .track-body {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          align-items: center;
        }
        .vinyl-mini {
          width: 70px;
          height: 70px;
          flex-shrink: 0;
        }
        .vinyl-spinning,
        .vinyl-static {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .mini-disc {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--dark-elevated) 0%, var(--dark) 100%);
          border-radius: 50%;
          border: 3px solid var(--primary);
          position: relative;
          box-shadow: 
            0 0 10px rgba(255, 107, 53, 0.4),
            inset 0 0 20px rgba(0, 0, 0, 0.8);
        }

        .mini-disc::before {
          content: '';
          position: absolute;
          width: 25%;
          height: 25%;
          background: var(--primary);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px rgba(255, 107, 53, 0.8);
        }

        .mini-disc::after {
          content: '';
          position: absolute;
          width: 10%;
          height: 10%;
          background: var(--dark);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .vinyl-spinning .mini-disc {
          animation: spin 2s linear infinite;
          border-color: var(--accent);
        }

        .vinyl-spinning .mini-disc::before {
          background: var(--accent);
          box-shadow: 0 0 15px var(--accent-glow);
        }

        .track-details {
          flex: 1;
          min-width: 0;
        }

        .track-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          color: var(--light);
          margin: 0 0 0.5rem 0;
          letter-spacing: 0.08em;
          line-height: 1.2;
          word-break: break-word;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .track-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .meta-label {
          color: var(--secondary);
          font-weight: 700;
        }

        .meta-value {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
        }

        /* AUDIO SECTION */
        .audio-section {
          margin-bottom: 1rem;
        }

        .audio-player {
          width: 100%;
          height: 50px;
          outline: none;
          filter: 
            drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))
            contrast(1.1);
        }

        audio::-webkit-media-controls-panel {
          background: linear-gradient(135deg, var(--dark-elevated) 0%, var(--dark) 100%);
          border: 2px solid var(--primary);
        }

        audio::-webkit-media-controls-play-button {
          background-color: var(--primary);
          border-radius: 50%;
        }

        audio::-webkit-media-controls-current-time-display,
        audio::-webkit-media-controls-time-remaining-display {
          color: var(--light);
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
        }

        audio::-webkit-media-controls-timeline {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          margin: 0 10px;
        }
        .now-playing-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(0, 255, 136, 0.1);
          border: 2px solid var(--accent);
          clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%);
        }

        .wave-group {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .wave {
          width: 3px;
          height: 20px;
          background: var(--accent);
          animation: wave 1s ease-in-out infinite;
        }

        .wave:nth-child(1) { animation-delay: 0s; }
        .wave:nth-child(2) { animation-delay: 0.1s; }
        .wave:nth-child(3) { animation-delay: 0.2s; }
        .wave:nth-child(4) { animation-delay: 0.3s; }
        .wave:nth-child(5) { animation-delay: 0.4s; }

        @keyframes wave {
          0%, 100% { height: 20px; }
          50% { height: 10px; }
        }

        .playing-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1rem;
          color: var(--accent);
          letter-spacing: 0.1em;
          flex: 1;
        }

        .playing-pulse {
          color: var(--accent);
          font-size: 1.2rem;
          animation: pulse 1s ease-in-out infinite;
        }
        @media (max-width: 1200px) {
          .track-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .music-container {
            padding: 1rem;
          }

          .library-title {
            font-size: 2.5rem;
          }

          .title-bracket {
            font-size: 3rem;
          }

          .title-icon {
            font-size: 2.5rem;
          }

          .track-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .track-card {
            padding: 1.25rem;
          }

          .track-number-section {
            font-size: 1.75rem;
          }

          .track-bracket {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .header-frame {
            padding: 1.5rem;
          }

          .library-title {
            font-size: 2rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .title-bracket {
            font-size: 2.5rem;
          }

          .track-counter {
            font-size: 0.75rem;
            padding: 0.5rem 0.75rem;
          }

          .counter-number {
            font-size: 1rem;
          }

          .track-body {
            flex-direction: column;
            align-items: flex-start;
          }

          .vinyl-mini {
            width: 60px;
            height: 60px;
          }

          .track-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MusicList;
