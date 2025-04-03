import React from 'react';
import { Link } from 'react-router-dom';

function SetupPage() {
  return (
    <div className="setup-container">
      <h2>ZENIFY AI Setup</h2>

      <form id="agentSetupForm">
        <label htmlFor="businessType">Business Type / Industry</label>
        <input type="text" id="businessType" name="businessType" placeholder="e.g. Salon, Coaching Center, D2C brand" />

        <label htmlFor="agentRole">Role of the AI Agent</label>
        <input type="text" id="agentRole" name="agentRole" placeholder="e.g. Customer support agent" />

        <label htmlFor="services">Products / Services You Offer</label>
        <textarea id="services" name="services" rows="3" placeholder="List services or products you offer"></textarea>

        <label htmlFor="questions">Common Questions You Get</label>
        <textarea id="questions" name="questions" rows="3" placeholder="e.g. What are your prices? Are you open today?" />

        <label htmlFor="tone">Tone of Voice</label>
        <select id="tone" name="tone">
          <option value="">-- Select Tone --</option>
          <option value="Polite">Polite</option>
          <option value="Friendly">Friendly</option>
          <option value="Formal">Formal</option>
          <option value="Youthful">Youthful</option>
        </select>

        <label>Languages to Support</label>
        <div className="checkbox-group">
          <label><input type="checkbox" name="languages" value="English" /> English</label>
          <label><input type="checkbox" name="languages" value="Hindi" /> Hindi</label>
          <label><input type="checkbox" name="languages" value="Kannada" /> Kannada</label>
          <label><input type="checkbox" name="languages" value="Tamil" /> Tamil</label>
          <label><input type="checkbox" name="languages" value="Telugu" /> Telugu</label>
        </div>

        <label htmlFor="goal">Goal of the Call</label>
        <input type="text" id="goal" name="goal" placeholder="e.g. Book an appointment, resolve issue quickly" />

        <label htmlFor="avoid">What should the AI avoid? (Optional)</label>
        <textarea id="avoid" name="avoid" rows="2" placeholder="e.g. Don’t discuss prices unless asked" />

        <Link to={"/dashboard"}><button type="submit">Generate Your Custom Zen Agent</button></Link> 
      </form>
    </div>
  );
}

export default SetupPage;
