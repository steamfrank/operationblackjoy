document.addEventListener("DOMContentLoaded", () => {
  const scrapbookGrid = document.getElementById("scrapbook-grid");
  const emptyGalleryMsg = document.getElementById("empty-gallery-msg");

  // Retrieve saved postcards from localStorage
  const savedPostcards = JSON.parse(localStorage.getItem("operationBlackJoyScrapbook")) || [];

  if (savedPostcards.length === 0) {
    emptyGalleryMsg.style.display = "block";
    return;
  }

  emptyGalleryMsg.style.display = "none";

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
            <img src="${data.frontImage}" alt="Scrapbook Postcard Front">
          </div>
          
          <div class="front-qr-badge" id="qr-btn-${index}" title="Scan or click to flip to back">
            <div id="${qrContainerId}"></div>
            <span>Flip Back</span>
          </div>
        </div>

        <div class="card-side card-back">
          <div class="back-header">
            <img src="assets/logo-transparent.png" alt="Operation Black Joy" class="back-logo-transparent">
            <div class="stamp-area">
              <img src="${data.stamp}" alt="Postcard Stamp">
            </div>
          </div>

          <div class="back-body">
            <div class="message-area">
              <p class="handwritten-text">${data.message}</p>
            </div>

            <div class="divider-line"></div>

            <div class="credit-area">
              <div class="credit-block">
                <p class="credit-line"><strong>Creator:</strong> PACSCL Archive Community</p>
                <p class="credit-line"><strong>Format & Publisher:</strong> Digital Archive Image, PACSCL</p>
                <p class="credit-line"><strong>Identifier:</strong> BJR-2026-OBJ</p>
              </div>

              <div class="source-link-container">
                <a href="${data.archiveUrl}" target="_blank" rel="noopener noreferrer" class="external-image-link">
                  🔗 Original Source
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    scrapbookGrid.appendChild(cardItem);

    // Generate QR Code on the front badge
    new QRCode(document.getElementById(qrContainerId), {
      text: data.archiveUrl || "https://blackjoy.pacscl.org/omeka/s/bjr/page/welcome",
      width: 42,
      height: 42,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });

    // Toggle 3D Flip on QR Code Badge click or Card click
    const cardElement = document.getElementById(`scrapbook-card-${index}`);
    cardElement.addEventListener("click", () => {
      cardElement.classList.toggle("is-flipped");
    });
  });
});
