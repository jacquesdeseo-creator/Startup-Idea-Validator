window.renderScoreCard = (scoreData, container) => {
    if (!scoreData) return;
    container.innerHTML = `
        <div class="score-header">
            <h4>Startup Viability Score</h4>
            <div class="score-circle">
                <span class="score-number">${scoreData.total}</span>
                <span class="score-max">/100</span>
            </div>
        </div>
        <div class="score-breakdown">
            ${Object.entries(scoreData.breakdown).map(([key, value]) => `
                <div class="breakdown-item">
                    <span class="breakdown-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${value * 10}%"></div>
                    </div>
                    <span class="breakdown-value">${value}/10</span>
                </div>
            `).join('')}
        </div>
    `;
};

window.renderKeyInsights = (insights, container) => {
    if (!insights || insights.length === 0) return;
    container.innerHTML = `
        <h4>Key Insights</h4>
        <ul class="insights-list custom-list">
            ${insights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
    `;
};

window.renderSections = (sections, container) => {
    if (!sections) return;
    const sectionConfig = [
        { key: 'summary', title: 'Startup Idea Summary', icon: '📝' },
        { key: 'targetCustomers', title: 'Target Customers', icon: '🎯' },
        { key: 'marketDemand', title: 'Market Demand', icon: '📈' },
        { key: 'competitorLandscape', title: 'Competitor Landscape', icon: '🔍' },
        { key: 'revenueModel', title: 'Revenue Model', icon: '💰' },
        { key: 'risks', title: 'Risks', icon: '⚠️' },
        { key: 'opportunities', title: 'Opportunities', icon: '✨' }
    ];

    container.innerHTML = sectionConfig.map(config => `
        <div class="result-card section-card">
            <h4><span class="section-icon">${config.icon}</span> ${config.title}</h4>
            <p>${sections[config.key] || 'N/A'}</p>
        </div>
    `).join('');
};

window.renderCompetitorTable = (competitors, container) => {
    if (!competitors || competitors.length === 0) {
        container.classList.add('hidden');
        return;
    }
    container.innerHTML = `
        <h4>Competitor Comparison</h4>
        <div class="table-responsive">
            <table class="competitor-table">
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>What They Do</th>
                        <th>Key Strength</th>
                    </tr>
                </thead>
                <tbody>
                    ${competitors.map(comp => `
                        <tr>
                            <td><strong>${comp.name}</strong></td>
                            <td>${comp.whatTheyDo}</td>
                            <td>${comp.keyStrength}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
};

window.renderSWOT = (swot, container) => {
    if (!swot) return;
    container.innerHTML = `
        <h4 style="text-align:center; margin-bottom: 20px;">SWOT Analysis</h4>
        <div class="swot-grid">
            <div class="swot-quadrant strengths">
                <h5>Strengths</h5>
                <ul class="custom-list">${swot.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
            <div class="swot-quadrant weaknesses">
                <h5>Weaknesses</h5>
                <ul class="custom-list">${swot.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
            </div>
            <div class="swot-quadrant opportunities">
                <h5>Opportunities</h5>
                <ul class="custom-list">${swot.opportunities.map(o => `<li>${o}</li>`).join('')}</ul>
            </div>
            <div class="swot-quadrant threats">
                <h5>Threats</h5>
                <ul class="custom-list">${swot.threats.map(t => `<li>${t}</li>`).join('')}</ul>
            </div>
        </div>
    `;
};

window.renderImprovements = (improvements, container) => {
    if (!improvements || improvements.length === 0) return;
    container.innerHTML = `
        <h4>Suggested Improvements</h4>
        <ul class="improvements-list custom-list">
            ${improvements.map(imp => `<li>${imp}</li>`).join('')}
        </ul>
    `;
};

window.renderSources = (sources, container) => {
    if (!sources || sources.length === 0) {
        container.innerHTML = `
            <h4>Fact-Checking Sources</h4>
            <p style="color: #a1a1aa; margin-top: 10px;">No specific external sources cited.</p>
        `;
        return;
    }
    
    let linksHtml = sources.map(source => `
        <li style="margin-bottom: 5px;">
            <a href="${source}" target="_blank" rel="noopener noreferrer" class="source-link">${source}</a>
        </li>
    `).join('');

    container.innerHTML = `
        <h4>Fact-Checking Sources / Evidence</h4>
        <ul class="custom-list" style="margin-top: 10px;">
            ${linksHtml}
        </ul>
    `;
};
