async function searchAI() {
    let query = document.getElementById("searchQuery").value;
    let aiKey = "YOUR_OPENAI_API_KEY";

    // 1. Get AI Answer
    let aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${aiKey}` },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: "You are a search assistant." },
                       { role: "user", content: `Search: ${query}`}]
        })
    });

    let aiData = await aiResponse.json();
    let aiAnswer = aiData.choices[0].message.content;

    // 2. Get DuckDuckGo Text Results
    let searchResponse = await fetch(`https://api.duckduckgo.com/?q=${query}&format=json`);
    let searchData = await searchResponse.json();

    // 3. Get DuckDuckGo Image Results
    let imageResponse = await fetch(`https://api.duckduckgo.com/?q=${query}&format=json&iax=images&ia=images`);
    let imageData = await imageResponse.json();

    // Build HTML output
    let resultsHTML = `<h2>AI Answer:</h2><p>${aiAnswer}</p><h2>Search Results:</h2>`;
    
    searchData.RelatedTopics.forEach(topic => {
        if (topic.Text) {
            resultsHTML += `<p><a href="${topic.FirstURL}" target="_blank">${topic.Text}</a></p>`;
        }
    });

    // Display Images
    resultsHTML += `<h2>Image Results:</h2><div class="image-results">`;
    if (imageData.ImageResults && imageData.ImageResults.length > 0) {
        imageData.ImageResults.forEach(img => {
            resultsHTML += `<a href="${img.Source}" target="_blank"><img src="${img.Thumbnail}" alt="${img.Title}" loading="lazy"></a>`;
        });
    } else {
        resultsHTML += `<p>No images found.</p>`;
    }
    resultsHTML += `</div>`;

    document.getElementById("results").innerHTML = resultsHTML;
}
