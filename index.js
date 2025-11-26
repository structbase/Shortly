const urlInput = document.getElementById("url-input");
const errorMessage = document.getElementById("error-text");
const shortenBtn = document.getElementById("shorten-Btn");
const renderLinks = document.getElementById("render-links");

const TOKEN = env.TOKEN;

async function fetchData(longUrl, TOKEN) {
    const apiUrl = "https://api-ssl.bitly.com/v4/shorten";

    const requestBody = {
        long_url: longUrl,
        domain: "bit.ly",
    };

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
    } catch {
        
    }
}
