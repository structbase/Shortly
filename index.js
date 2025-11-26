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

// --- Create Bootstrap card ---
function createLinkCard(originalUrl, shortUrl) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "place-of-links container p-3 rounded shadow-sm mb-3";
    cardDiv.style.background = "#fff";

    cardDiv.innerHTML = `
        <div class="row">
            <div class="col-12">
                <p class="m-0 fw-semibold text-dark">${originalUrl}</p>
            </div>
            <div class="col-12">
                <hr class="my-3" />
            </div>
            <div class="col-12 mb-3">
                <p class="m-0 fw-semibold" style="color: #2acfcf">
                    <a href="${shortUrl}" target="_blank" class="text-decoration-none" style="color: #2acfcf;">
                        ${shortUrl}
                    </a>
                </p>
            </div>
            <div class="col-12">
                <button class="btn w-100 text-white copy-btn" style="background: #2acfcf;">Copy</button>
            </div>
        </div>
    `;

    // Copy button
    const copyBtn = cardDiv.querySelector(".copy-btn");
    copyBtn.addEventListener("click", () => {
        navigator.clipboard
            .writeText(shortUrl)
            .then(() => alert("Copied!"))
            .catch(() => alert("Failed to copy"));
    });

    return cardDiv;
}

// --- Event listener ---
shortenBtn.addEventListener("click", async () => {
    const longUrl = urlInput.value.trim();
    if (!longUrl) {
        errorMessage.textContent = "Please enter a URL.";
        return;
    }

    try {
        const shortLink = await fetchData(longUrl, TOKEN);
        const card = createLinkCard(longUrl, shortLink);
        renderLinks.prepend(card); // newest first
        saveLink(longUrl, shortLink); // save to local storage
        urlInput.value = "";
        errorMessage.textContent = "";
    } catch (error) {
        console.error(error);
        errorMessage.textContent = "Failed to shorten URL.";
    }
});
