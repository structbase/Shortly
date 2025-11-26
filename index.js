const urlInput = document.getElementById("url-input");
const errorMessage = document.getElementById("error-text");
const shortenBtn = document.getElementById("shorten-Btn");
const renderLinks = document.getElementById("render-links");

const TOKEN = "1e93bd6ac750c73895adf0ae72366562fa83f28a";

async function fetchData(longUrl, TOKEN) {
    const apiUrl = "https://api-ssl.bitly.com/v4/shorten";
    const requestBody = { long_url: longUrl, domain: "bit.ly" };
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    };
    try {
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Bitly Response Error: ${response.status}`);
        }
        const data = await response.json();
        return data.link;
    } catch (error) {
        console.error("Error shortening URL:", error);
        throw error;
    }
}

shortenBtn.addEventListener("click", async () => {
    const longUrl = urlInput.value.trim();

    if (!longUrl) {
        errorMessage.textContent = "Please enter a URL.";
        return;
    }

    try {
        const shortLink = await fetchData(longUrl, TOKEN);

        const linkEl = document.createElement("p");
        linkEl.textContent = shortLink;
        renderLinks.appendChild(linkEl);

        urlInput.value = "";
        errorMessage.textContent = "";
    } catch (error) {
        console.error(error);
        errorMessage.textContent = "Failed to shorten URL.";
    }
});
