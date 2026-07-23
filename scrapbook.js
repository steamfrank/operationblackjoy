document.addEventListener("DOMContentLoaded", () => {
  const scrapbookGrid = document.getElementById("scrapbook-grid");
  const emptyStateMsg = document.getElementById("empty-gallery-msg");

  let savedCards = [];
  let currentIndex = 0;
  // Pre-generate random organic rotations for each card index so they remain consistent during cycle
  let cardRotations = [];

  // Helper function: Generates dynamic QR code for AR viewer
  function getARQRCodeUrl(cardId) {
    const currentPath = window.location.href.split('#')[0].split('?')[0];
    const baseUrl = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    const arTargetUrl = `${baseUrl}ar.html?id=${cardId}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(arTargetUrl)}`;
  }

  function loadScrapbook() {
    savedCards = JSON.parse(localStorage.getItem("operationBlackJoyScrapbook")) || [];

    if (!scrapbookGrid) return;
    scrapbookGrid.innerHTML = "";

    if (savedCards.length === 0) {
      if (emptyStateMsg) emptyStateMsg.style.display = "block";
      return;
    }

    if (emptyStateMsg) emptyStateMsg.style.display = "none";

    // Setup wrapper for photo stack
    scrapbookGrid.classList.add("photo-stack-wrapper");

    // Generate fixed random rotations for messy look
    cardRotations = savedCards.map(() => {
      // Random tilt between -8deg and +8deg (avoiding 0deg for background cards)
      const angle = (Math.random() * 14 - 7);
      return Math.abs(angle) < 2 ? (angle < 0 ? -4 : 4) : angle;
    });

    renderStack();
  }

  function renderStack() {
    scrapbookGrid.innerHTML = "";

    // Create a container for controls
    const stackContainer = document.createElement("div");
    stackContainer.className = "photo-stack-container";

    savedCards.forEach((cardData, index) => {
      const cardItem = document.createElement("div");
      cardItem.className = "stacked-card";

      // Determine stacking position relative to current active index
      const position = (index - currentIndex + savedCards.length) % savedCards.length;
      const zIndex = savedCards.length - position;

      cardItem.style.zIndex = zIndex;

      if (position === 0) {
        // Active top card: straight, highlighted, scale 1.0
        cardItem.classList.add("active-card");
        cardItem.style.transform = `rotate(0deg) scale(1)`;
      } else {
        // Messy stacked cards behind: apply saved random tilt and slight scaling/offset
        const rotation = cardRotations[index];
        const depthOffset = Math.min(position * 3, 12); // Subtle vertical depth shift
        cardItem.style.transform = `rotate(${rotation}deg) translateY(${depthOffset}px) scale(0.97)`;
        cardItem.classList.add("stacked-behind");
      }

      const arQrCodeUrl = getARQRCodeUrl(cardData.id);
      const orientationClass = cardData.orientation === "portrait" ? "format-portrait" : "format-landscape";

      cardItem.innerHTML = `
        <div class="scrapbook-postcard static-card">
          <div class="card-side card-front ${orientationClass}">
            <div class="photo-frame">
              <img src="${cardData.frontImage}" alt="Saved Postcard Photo" draggable="false">
            </div>
            <div class="front-qr-badge">
              <img src="${arQrCodeUrl}" alt="Scan for AR" width="55" height="55">
              <span>Scan AR</span>
            </div>
          </div>
        </div>
      `;

      // Clicking any card cycles to the next image in the stack
      cardItem.addEventListener("click", () => {
        cycleNextCard();
      });

      stackContainer.appendChild(cardItem);
    });

    // Append navigation helper & counter below stack
    const controlsDiv = document.createElement("div");
    controlsDiv.className = "stack-controls";
    controlsDiv.innerHTML = `
      <p class="stack-counter">Postcard ${currentIndex + 1} of ${savedCards.length} — <em>Tap stack to dig through</em></p>
      <button id="next-stack-btn" class="action-btn" style="width: auto; padding: 0.6rem 1.25rem;">Next Postcard ➔</button>
    `;

    scrapbookGrid.appendChild(stackContainer);
    scrapbookGrid.appendChild(controlsDiv);

    document.getElementById("next-stack-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      cycleNextCard();
    });
  }

  function cycleNextCard() {
    if (savedCards.length <= 1) return;
    currentIndex = (currentIndex + 1) % savedCards.length;
    renderStack();
  }

  loadScrapbook();
});
