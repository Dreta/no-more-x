const logoGroup = `<g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" fill="#1d9bf0"/></g>`;
const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${logoGroup}</svg>`;

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

function svgToDataUri(svg) {
    let encoded = svg.replace(/\s+/g, " ");
    encoded = replaceAll(encoded, "%", "%25");
    encoded = replaceAll(encoded, "> <", "><");
    encoded = replaceAll(encoded, "; }", ";}");
    encoded = replaceAll(encoded, "<", "%3c");
    encoded = replaceAll(encoded, ">", "%3e");
    encoded = replaceAll(encoded, '"', "'");
    encoded = replaceAll(encoded, "#", "%23");
    encoded = replaceAll(encoded, "{", "%7b");
    encoded = replaceAll(encoded, "}", "%7d");
    encoded = replaceAll(encoded, "|", "%7c");
    encoded = replaceAll(encoded, "^", "%5e");
    encoded = replaceAll(encoded, "`", "%60");
    encoded = replaceAll(encoded, "@", "%40");
    return "data:image/svg+xml;charset=UTF-8," + encoded.trim();
}

function updateTitle() {
    const title = document.querySelector("title");
    if (title) {
        if (title.innerText === "X") {
            title.innerText = "Twitter";
        } else if (title.innerText.includes(" / X")) {
            title.innerText = title.innerText.replace(/ \/ X/g, " / Twitter");
        } else if (title.innerText.includes(" on X")) {
            title.innerText = title.innerText.replace(/ on X/g, " on Twitter");
        }
    }
}

async function init() {
    const loadingLogoWrapper = document.querySelector("#placeholder svg");
    if (loadingLogoWrapper !== null) {
        loadingLogoWrapper.innerHTML = logoGroup;
    }

    const config = { childList: true, subtree: true };
    const callback = (mutationList, observer) => {
        const logoWrapper = document.querySelectorAll(
            "#react-root header h1[role='heading'] a div svg"
        )[0];

        if (mutationList[0].target === logoWrapper) {
            return;
        }

        let favicons = document.querySelectorAll('link[rel~="icon"]');
        favicons.forEach(function (favicon) {
            favicon.parentNode.removeChild(favicon);
        });

        let link =
            document.querySelector("link[rel*='icon']") ||
            document.createElement("link");
        link.type = "image/png";
        link.rel = "shortcut icon";
        link.href = svgToDataUri(logo);
        document.getElementsByTagName("head")[0].appendChild(link);

        logoWrapper.innerHTML = logoGroup;
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.getElementById("react-root"), config);
    
    const interval = setInterval(() => {
        if (document.querySelector('title') != null) {
            const titleObserver = new MutationObserver(updateTitle);
            titleObserver.observe(document.querySelector('title'), config);
            updateTitle();
            clearInterval(interval);
        }
    }, 500); 
}

init();
