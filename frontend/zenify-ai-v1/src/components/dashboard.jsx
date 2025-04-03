import React from 'react';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const snippet = `<script src="https://your-backend.com/widget.js" data-mount="zen-root"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    alert("✅ Copied to clipboard!");
  };

  return (
    <div className="dashboard-container">
      <h2>📞 Zen Agents Dashboard</h2>

      {/* Section: Customer Service Code Snippet */}
      <div className="card">
        <h3>Your AI Customer Service Code Snippet</h3>
        <div className="code-snippet-box" style={{ background: "#f5f5f5", padding: "10px", borderRadius: "8px", fontFamily: "monospace", fontSize: "14px", position: "relative" }}>
          <code>&lt;script src="https://your-backend.com/widget.js" data-mount="zen-root"&gt;&lt;/script&gt;</code>
          <button onClick={handleCopy} style={{ position: "absolute", right: "10px", top: "10px", cursor: "pointer" }}>📋 Copy</button>
        </div>
        <small>You can add this code snippet to your website or social media pages.</small><br />
        <small>Try Once: </small>
        <Link to="/talktozen"><button>Talk to Zen</button></Link>
      </div>

      {/* Section: Transcripts */}
      <div className="card">
        <h3>📂 Call Transcripts</h3>
        <div className="transcript-list">
          <div className="transcript-item">
            <div className="transcript-header">
              <span>📅 April 2, 2025</span>
              <span>🕒 3:15 PM</span>
            </div>
            <p className="transcript-snippet">
              Customer: Hello, I wanted to know your store timings...<br />
              AI Agent: Sure! We're open from 10 AM to 8 PM every day.
            </p>
            <button className="view-button">View Full Transcript</button>
          </div>
        </div>
      </div>

      {/* Section: Credit Info */}
      <div className="card info-card">
        <h4>⚠️ You have 1 free call remaining</h4>
        <p>Upgrade your plan or wait for next cycle to get more calls.</p>
        <button className="upgrade-button">Upgrade Plan</button>
      </div>
    </div>
  );
}

export default DashboardPage;
