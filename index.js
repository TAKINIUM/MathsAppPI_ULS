document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const slideNumber = urlParams.get("slide");

    if (slideNumber) {
        const iframe = document.getElementById("googleSlidesIframe");
        const baseUrl = "https://docs.google.com/presentation/d/1kNzO26xUImX86H_z09Y680wIT0uVrMJE1O1PRY2qA7k/embed?start=false&loop=false&slide=";
        iframe.src = baseUrl + (slideNumber - 1);
    }
});

function goToAnimation(animationId) {
    window.location.href = `${animationId}`;
}