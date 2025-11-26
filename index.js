const urlInput = document.getElementById("url-input");
const errorMessage = document.getElementById("error-text");
const shortenBtn = document.getElementById("shorten-Btn");
const renderLinks = document.getElementById("render-links");

const TOKEN = "1e93bd6ac750c73895adf0ae72366562fa83f28a";

/**
 * async fetch function
 * @param {string} longUrl The URL to shorten.
 * @param {string} TOKEN The Bitly API token.
 * @returns {Promise<string>} The shortened URL.
 */
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

/**
 * Creates link card.
 * @param {string} originalUrl The original URL.
 * @param {string} shortUrl The shortened URL.
 * @returns {HTMLElement} The card element.
 */
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

    // functional copy button  
    const copyBtn = cardDiv.querySelector(".copy-btn");
    copyBtn.addEventListener("click", () => {
        navigator.clipboard
            .writeText(shortUrl)
            .then(() => {
                copyBtn.textContent = "Copied!";
                copyBtn.style.backgroundColor = "#3b3054";
            })
            .catch((err) => {
                console.error("Failed to copy", err);
                copyBtn.textContent = "Error";
                copyBtn.style.backgroundColor = "#dc3545"; // Bootstrap Danger Red
            });
    });

    return cardDiv;
}

/**
 * Saves a new link pair to localStorage.
 * Retrieves existing links, adds the new one, and saves the updated array.
 */
function saveLink(originalUrl, shortUrl) {
    const links = JSON.parse(localStorage.getItem("shortenedLinks")) || [];
    links.push({ originalUrl, shortUrl });
    localStorage.setItem("shortenedLinks", JSON.stringify(links));
}

/**
 * Loads and renders saved links on page load.
 */
function loadLinks() {
    const links = JSON.parse(localStorage.getItem("shortenedLinks")) || [];
    links.forEach((link) => {
        const card = createLinkCard(link.originalUrl, link.shortUrl);
        renderLinks.appendChild(card);
    });
}

/**
 * Handles the "Shorten It!" button click.
 * Validates input, calls API, renders the result, saves to storage, and handles errors.
 */
shortenBtn.addEventListener("click", async () => {
    const longUrl = urlInput.value.trim();
    if (!longUrl) {
        errorMessage.textContent = "Please enter a URL.";
        return;
    }

    try {
        const shortLink = await fetchData(longUrl, TOKEN);
        const card = createLinkCard(longUrl, shortLink);
        renderLinks.prepend(card); 
        saveLink(longUrl, shortLink);
        urlInput.value = "";
        errorMessage.textContent = "";
    } catch (error) {
        console.error(error);
        errorMessage.textContent = "Failed to shorten URL.";
    }
});

// Loading if links already exist
loadLinks();
