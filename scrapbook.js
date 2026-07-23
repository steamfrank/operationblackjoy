document.addEventListener("DOMContentLoaded", () => {
  const scrapbookGrid = document.getElementById("scrapbook-grid");
  const emptyStateMsg = document.getElementById("empty-gallery-msg");

  // Helper function: Generates a QR code pointing to the AR Viewer page on your site
  function getARQRCodeUrl(cardId) {
    // Gets the current site domain/origin (or defaults to current path)
    const baseUrl = window.location.origin + window.location.pathname.replace("scrapbook.html", "");
    
    // Target AR viewer URL with the specific card ID in query params
    const arTargetUrl = `${baseUrl}ar.html?id=${cardId}`;
    
    // Encodes for QR Server API
    const safeUrl = encodeURIComponent(arTargetUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${safeUrl}`;
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

    // Generate AR launch QR code using card's unique ID
    const arQrCodeUrl = getARQRCodeUrl(cardData.id);
    const orientationClass = cardData.orientation === "portrait" ? "format-portrait" : "format-landscape";

    cardItem.innerHTML = `
      <div class="scrapbook-postcard static-card">
        <div class="card-side card-front ${orientationClass}">
          <div class="photo-frame">
            <img src="${cardData.frontImage}" alt="Saved Postcard Photo">
          </div>
          <div class="front-qr-badge">
            <img src="${arQrCodeUrl}" alt="Scan to Launch AR" width="65" height="65">
            <span>Scan for AR</span>
          </div>
        </div>
      </div>
    `;

    return cardItem;
  }

  // Initialize scrapbook gallery on load
  loadScrapbook();
});
