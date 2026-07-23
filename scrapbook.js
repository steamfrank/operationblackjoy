document.addEventListener("DOMContentLoaded", () => {
  const scrapbookGrid = document.getElementById("scrapbook-grid");
  const emptyGalleryMsg = document.getElementById("empty-gallery-msg");

  // Retrieve saved postcards from localStorage
  const savedPostcards = JSON.parse(localStorage.getItem("operationBlackJoyScrapbook")) || [];

  // Show or hide empty state message
  if (savedPostcards.length === 0) {
    if (emptyGalleryMsg) emptyGalleryMsg.style.display = "block";
    return;
  } else {
    if (emptyGalleryMsg) emptyGalleryMsg.style.display = "none";
  }

  // Render each postcard item into the gallery
  savedPostcards.forEach((data, index) => {
    const cardItem = document.createElement("div");
    cardItem.className = "scrapbook-card-item";

    const formatClass = data.orientation === "portrait" ? "format-portrait" : "format-landscape";
    const qrContainerId = `qr-code-badge-${index}`;

    cardItem.innerHTML = `
      <div class="scrapbook-postcard" id="scrapbook-card-${index}">
        
        <div class="card-side card-front ${formatClass}">
          <div class="photo-frame">
            <img src="${data.frontImage}" alt="Scrapbook Postcard Front" onerror="this.src='assets/default-postcard.png'">
          </div>
          
          <div class="front-qr-badge" id="qr-badge-wrapper-${index}" title="Scan to launch back of card or click to flip">
            <div id="${qrContainerId}"></div>
            <span>Scan / Flip</span>
          </div>
        </div>

        <div class="card-side card-back">
          <div class="back-header">
            <img src="assets/logo-transparent.png" alt="Operation Black Joy" class="back-logo-transparent">
            <div class="stamp-area">
              <img src="${data.stamp || 'assets/stamp-aaam2026.png'}" alt="Postcard Stamp">
            </div>
          </div>

          <div class="back-body">
            <div class="message-area">
              <p class="handwritten-text">${data.message || 'Sending joy & resilience from Operation: Black Joy!'}</p>
            </div>

            <div class="divider-line"></div>

            <div class="credit-area">
              <div class="credit-block">
                <p class="credit-line"><strong>Creator:</strong> PACSCL Archive Community</p>
                <p class="credit-line"><strong>Format & Publisher:</strong> Digital Archive Image, PACSCL</p>
                <p class="credit-line"><strong>Identifier:</strong> BJR-2026-OBJ</p>
              </div>

              <div class="source-link-container">
                <a href="${data.archiveUrl || 'https://blackjoy.pacscl.org/omeka/s/bjr/page/welcome'}" target="_blank" rel="noopener noreferrer" class="external-image-link" onclick="event.stopPropagation();">
                  🔗 Original Source
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    scrapbookGrid.appendChild(cardItem);

    // Render the QR code into the container after element is appended to DOM
    setTimeout(() => {
      const qrContainer = document.getElementById(qrContainerId);
      if (qrContainer && typeof QRCode !== "undefined") {
        qrContainer.innerHTML = ""; // Clear any previous instance
        
        const qrUrl = data.archiveUrl && data.archiveUrl.startsWith("http") 
          ? data.archiveUrl 
          : "https://blackjoy.pacscl.org/omeka/s/bjr/page/welcome";

        new QRCode(qrContainer, {
          text: qrUrl,
          width: 52,
          height: 52,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    }, 50);

    // Toggle 3D Flip on card click
    const cardElement = document.getElementById(`scrapbook-card-${index}`);
    if (cardElement) {
      cardElement.addEventListener("click", () => {
        cardElement.classList.toggle("is-flipped");
      });
    }
  });
});
