document.addEventListener("DOMContentLoaded", () => {
  const scrapbookGrid = document.getElementById("scrapbook-grid");
  const emptyGalleryMsg = document.getElementById("empty-gallery-msg");

  // Retrieve saved postcards from localStorage
  const savedPostcards = JSON.parse(localStorage.getItem("operationBlackJoyScrapbook")) || [];

  if (savedPostcards.length === 0) {
    if (emptyGalleryMsg) emptyGalleryMsg.style.display = "block";
    return;
  } else {
    if (emptyGalleryMsg) emptyGalleryMsg.style.display = "none";
  }

  // Render each postcard front item into the gallery
  savedPostcards.forEach((data, index) => {
    const cardItem = document.createElement("div");
    cardItem.className = "scrapbook-card-item";

    const formatClass = data.orientation === "portrait" ? "format-portrait" : "format-landscape";
    const qrContainerId = `qr-code-badge-${index}`;

    // Valid fallback image path if data.frontImage fails to load
    const imageSrc = data.frontImage && data.frontImage.trim() !== "" 
      ? data.frontImage 
      : "assets/default-postcard.png";

    cardItem.innerHTML = `
      <div class="scrapbook-postcard static-card" id="scrapbook-card-${index}">
        
        <div class="card-side card-front ${formatClass}">
          <div class="photo-frame">
            <img src="${imageSrc}" alt="Scrapbook Postcard Front" onerror="this.onerror=null; this.src='assets/default-postcard.png';">
          </div>
          
          <div class="front-qr-badge" id="qr-badge-wrapper-${index}" title="Scan to view AR Postcard Back on device">
            <div id="${qrContainerId}"></div>
            <span>Scan for AR Back</span>
          </div>
        </div>

      </div>
    `;

    scrapbookGrid.appendChild(cardItem);

    // Build the AR target URL carrying postcard data to render on the mobile device
    const baseUrl = window.location.origin + window.location.pathname.replace("scrapbook.html", "ar-view.html");
    const arPayloadUrl = `${baseUrl}?id=${data.id || index}&msg=${encodeURIComponent(data.message || '')}&stamp=${encodeURIComponent(data.stamp || '')}`;

    // Render QR Code after DOM insertion
    setTimeout(() => {
      const qrContainer = document.getElementById(qrContainerId);
      if (qrContainer && typeof QRCode !== "undefined") {
        qrContainer.innerHTML = "";
        
        new QRCode(qrContainer, {
          text: arPayloadUrl,
          width: 58,
          height: 58,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    }, 50);
  });
});
