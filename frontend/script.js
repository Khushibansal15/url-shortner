document.addEventListener('DOMContentLoaded', () => {
    const shortenForm = document.getElementById('shorten-form');
    const urlInput = document.getElementById('url-input');
    const shortenedUrlDiv = document.getElementById('shortened-url');
    const analyticsForm = document.getElementById('analytics-form');
    const shortIdInput = document.getElementById('short-id-input');
    const analyticsResultsDiv = document.getElementById('analytics-results');

    shortenForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = urlInput.value;

        try {
            const response = await fetch('/url', {  // Adjusted to relative path
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const data = await response.json();
            if (response.ok) {
                shortenedUrlDiv.innerHTML = `<p>Short URL: <a href="/${data.id}" target="_blank">http://localhost:8001/${data.id}</a></p>`;
            } else {
                shortenedUrlDiv.innerHTML = `<p>Error: ${data.error}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            shortenedUrlDiv.innerHTML = '<p>Something went wrong. Please try again.</p>';
        }
    });

    analyticsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const shortId = shortIdInput.value;

        try {
            const response = await fetch(`/url/analytics/${shortId}`);  // Adjusted to relative path
            const data = await response.json();

            if (response.ok) {
                analyticsResultsDiv.innerHTML = `<p>Total Clicks: ${data.totalClicks}</p><pre>${JSON.stringify(data.analytics, null, 2)}</pre>`;
            } else {
                analyticsResultsDiv.innerHTML = `<p>Error: URL not found</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            analyticsResultsDiv.innerHTML = '<p>Something went wrong. Please try again.</p>';
        }
    });
});
