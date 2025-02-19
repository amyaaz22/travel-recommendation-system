// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    await loadDefaultRecommendations();
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('searchButton').addEventListener('click', handleSearch);
    document.getElementById('clearButton').addEventListener('click', clearResults);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

// Search Handler
async function handleSearch() {
    const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!keyword) return;

    try {
        const data = await fetchData();
        const results = searchData(data, keyword);
        displayResults(results);
    } catch (error) {
        showError('Error searching recommendations');
        console.error('Search error:', error);
    }
}

// Search Logic
function searchData(data, keyword) {
    return data.recommendations.flatMap(item => {
        if (item.type === 'country') {
            return item.cities.filter(city => 
                city.name.toLowerCase().includes(keyword) ||
                item.keywords.some(kw => kw.toLowerCase().includes(keyword))
            ).map(city => ({
                ...city,
                mainImage: item.imageUrl,
                type: 'city'
            }));
        }
        return item.keywords.some(kw => kw.toLowerCase().includes(keyword)) ? [item] : [];
    }).flat();
}

// Display Results
function displayResults(results) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = '<p class="no-results">No matching destinations found. Try another search!</p>';
        return;
    }

    results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'result-item';
        card.innerHTML = `
            <img src="${item.imageUrl || item.mainImage}" alt="${item.name}" class="result-image">
            <div class="result-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                ${item.type === 'city' ? `<p class="country">Country: ${item.country}</p>` : ''}
                <button class="cta-btn">View Details</button>
            </div>
        `;
        container.appendChild(card);
    });
}