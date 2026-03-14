document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const ideaInput = document.getElementById('ideaInput');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    const scoreContainer = document.getElementById('scoreContainer');
    const insightsContainer = document.getElementById('insightsContainer');
    const sectionsContainer = document.getElementById('sectionsContainer');
    const competitorsContainer = document.getElementById('competitorsContainer');
    const swotContainer = document.getElementById('swotContainer');
    const improvementsContainer = document.getElementById('improvementsContainer');
    const sourcesContainer = document.getElementById('sourcesContainer');

    // Only attach event listeners if we are on the analyze page
    if (!analyzeBtn || !ideaInput) return;

    analyzeBtn.addEventListener('click', async () => {
        const idea = ideaInput.value.trim();

        if (!idea) {
            alert('Please enter a startup idea first!');
            return;
        }

        const wordCount = idea.split(/\s+/).filter(word => word.length > 0).length;
        if (wordCount < 8) {
            alert("Please describe your idea more clearly, ideally in 1-2 complete sentences. A single word or short phrase isn't enough to analyze.");
            return;
        }

        // Hide results, show loading
        results.classList.add('hidden');
        loading.classList.remove('hidden');

        try {
            await generateAnalysis(idea);
            loading.classList.add('hidden');
            results.classList.remove('hidden');
            
            // Scroll to results
            results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (error) {
            console.error(error);
            loading.classList.add('hidden');
            alert("An error occurred while generating the analysis. Please check your API key and try again.\n\nError: " + error.message);
        }
    });

    async function generateAnalysis(idea) {
        // Call our Vercel Serverless Function instead of the external API directly
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idea: idea })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server Request failed (${response.status})`);
        }

        const parsedAnalysis = await response.json();

        window.renderScoreCard(parsedAnalysis.viabilityScore, scoreContainer);
        window.renderKeyInsights(parsedAnalysis.keyInsights, insightsContainer);
        window.renderSections(parsedAnalysis.sections, sectionsContainer);
        window.renderCompetitorTable(parsedAnalysis.competitors, competitorsContainer);
        window.renderSWOT(parsedAnalysis.swot, swotContainer);
        window.renderImprovements(parsedAnalysis.suggestedImprovements, improvementsContainer);
        window.renderSources(parsedAnalysis.sources, sourcesContainer);
    }
});
