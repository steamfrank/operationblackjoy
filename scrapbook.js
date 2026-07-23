document.addEventListener("DOMContentLoaded", () => {
  const scrapbookGrid = document.getElementById("scrapbook-grid");
  const emptyStateMsg = document.getElementById("empty-gallery-msg");

  // Helper function: Uses QR Server API to generate a reliable QR image URL
  function getQRCodeUrl(targetUrl) {
    const safeUrl = encodeURIComponent(targetUrl || "https://blackjoy.pacscl.org/omeka/s/bjr/page/welcome");
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${safeUrl}`;
  }

  // Load saved postcards from localStorage
  function loadScrapbook() {
    const savedCards = JSON.parse(localStorage.getItem("operationBlackJoyScrapbook")) || [];

    if (!scrapbookGrid) return;

    // Clear existing grid contents
    scrapbookGrid.innerHTML = "";

    if (savedCards.length === 0) {
      if (emptyStateMsg) emptyStateMsg.style.display = "block";
      return;
    }

    if (emptyStateMsg) emptyStateMsg.style.display = "none";

    // Render each saved postcard
    savedCards.forEach((cardData) => {
      const cardElement = createScrapbookCardElement(cardData);
      scrapbookGrid.appendChild(cardElement);
    });
  }

  // Generate HTML structure for an individual scrapbook item
  function createScrapbookCardElement(cardData) {
    const cardItem = document.createElement("div");
    cardItem.className = "scrapbook-card-item";

    const qrCodeImageUrl = getQRCodeUrl(cardData.archiveUrl);
    const orientationClass = cardData.orientation === "portrait" ? "format-portrait" : "format-landscape";

    cardItem.innerHTML = `
      <div class="scrapbook-postcard static-card">
        <div class="card-side card-front ${orientationClass}">
          <div class="photo-frame">
            <img src="${cardData.frontImage}" alt="Saved Postcard Photo">
          </div>
          <div class="front-qr-badge">
            <img src="${qrCodeImageUrl}" alt="Scan AR QR Code" width="55" height="55">
            <span>Scan Source</span>
          </div>
        </div>
      </div>
    `;

    return cardItem;
  }

  // Initialize scrapbook on page load
  loadScrapbook();
});
