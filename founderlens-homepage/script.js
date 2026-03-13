document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const ideaInput = document.getElementById('ideaInput');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    const resAudience = document.getElementById('resAudience');
    const resDemand = document.getElementById('resDemand');
    const resMonetization = document.getElementById('resMonetization');
    const resRisks = document.getElementById('resRisks');

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

        resAudience.textContent = parsedAnalysis.audience || "N/A";
        resDemand.textContent = parsedAnalysis.demand || "N/A";
        resMonetization.textContent = parsedAnalysis.monetization || "N/A";
        resRisks.textContent = parsedAnalysis.risks || "N/A";
    }
});
