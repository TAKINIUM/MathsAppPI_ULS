function goToMainPage(slideNumber) {
    const mainPageUrl = "index.html";
    window.location.href = `${mainPageUrl}?slide=${slideNumber+1}`;
}