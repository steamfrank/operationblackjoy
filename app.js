document.addEventListener("DOMContentLoaded", () => {
  const eventModal = document.getElementById("event-modal");
  const startAppBtn = document.getElementById("start-app-btn");
  const selectedStampImg = document.getElementById("selected-stamp");
  
  const postcardPhoto = document.getElementById("postcard-photo");
  const cardFrontWrapper = document.getElementById("card-front-wrapper");
  const archiveUrlInput = document.getElementById("archive-url-input");
  const pageNumberInput = document.getElementById("page-number-input");
  
  const messageInput = document.getElementById("message-input");
  const charCount = document.getElementById("char-count");
  const displayMessage = document.getElementById("display-message");
  
  const flipBtn = document.getElementById("flip-btn");
  const postcard = document.getElementById("postcard-element");
  const saveScrapbookBtn = document.getElementById("save-scrapbook-btn");
  const archiveSourceLink = document.getElementById("archive-source-link");

  let activeStampPath = "assets/stamp-aaam2026.png";
  const defaultFallbackImage = "assets/default-postcard.png";

  // Modal Setup
  if (startAppBtn) {
    startAppBtn.addEventListener("click", () => {
      const selectedEvent = document.querySelector('input[name="event-selection"]:checked').value;
      activeStampPath = selectedEvent === "aaam" ? "assets/stamp-aaam2026.png" : "assets/stamp-anyonecanfly.png";
      
      if (selectedStampImg) selectedStampImg.src = activeStampPath;
      if (eventModal) eventModal.style.display = "none";
    });
  }

  // Character Counter & Live Note Update
  if (messageInput) {
    messageInput.addEventListener("input", (e) => {
      const currentLength = e.target.value.length;
      if (charCount) charCount.textContent = currentLength;
      if (displayMessage) {
        displayMessage.textContent = e.target.value.trim() || "Sending joy & resilience from Operation: Black Joy!";
      }
    });
  }

  // Flip Toggle
  if (flipBtn && postcard) {
    flipBtn.addEventListener("click", () => {
      postcard.classList.toggle("is-flipped");
    });
  }

 // Asynchronous image loader that handles direct URLs and Omeka web links
async function processImageAspect(imgUrl) {
  const defaultFallbackImage = "assets/default-postcard.png";
  
  if (!imgUrl || imgUrl.trim() === "") {
    loadFallback(defaultFallbackImage);
    return;
  }

  let targetUrl = imgUrl.trim();

  try {
    // 1. Fetch image directly as a binary blob (bypasses standard tag hotlinking blocks)
    const response = await fetch(targetUrl, { mode: 'cors' });
    
    if (!response.ok) throw new Error("Image request failed");

    const blob = await response.blob();
    const localBlobUrl = URL.createObjectURL(blob);

    // 2. Load into DOM Image object to detect dimensions
    const tempImg = new Image();
    tempImg.src = localBlobUrl;

    tempImg.onload = () => {
      if (postcardPhoto) postcardPhoto.src = localBlobUrl;
      
      const width = tempImg.naturalWidth;
      const height = tempImg.naturalHeight;

      if (cardFrontWrapper) {
        cardFrontWrapper.classList.remove("format-landscape", "format-portrait");
        if (height > width) {
          cardFrontWrapper.classList.add("format-portrait");
        } else {
          cardFrontWrapper.classList.add("format-landscape");
        }
      }
    };

    tempImg.onerror = () => {
      loadFallback(defaultFallbackImage);
    };

  } catch (error) {
    console.warn("Direct blob fetch unsuccessful, attempting direct URL fallback:", error);
    // Direct URL fallback if CORS fetch is blocked
    if (postcardPhoto) postcardPhoto.src = targetUrl;
  }
}

function loadFallback(fallbackPath) {
  if (postcardPhoto) postcardPhoto.src = fallbackPath;
  if (cardFrontWrapper) {
    cardFrontWrapper.classList.remove("format-portrait");
    cardFrontWrapper.classList.add("format-landscape");
  }
}
  // Live Archive URL input change
  if (archiveUrlInput) {
    archiveUrlInput.addEventListener("input", () => {
      const url = archiveUrlInput.value.trim();
      if (archiveSourceLink) {
        archiveSourceLink.href = url || "https://blackjoy.pacscl.org/omeka/s/bjr/page/welcome";
      }
      processImageAspect(url);
    });
  }

  // Save to Scrapbook
  if (saveScrapbookBtn) {
    saveScrapbookBtn.addEventListener("click", () => {
      const isPortrait = cardFrontWrapper ? cardFrontWrapper.classList.contains("format-portrait") : false;

      const postcardData = {
        id: Date.now(),
        frontImage: postcardPhoto ? postcardPhoto.src : defaultFallbackImage,
        orientation: isPortrait ? "portrait" : "landscape",
        message: displayMessage ? displayMessage.textContent : "Sending joy & resilience from Operation: Black Joy!",
        stamp: activeStampPath,
        archiveUrl: archiveSourceLink ? archiveSourceLink.href : "https://blackjoy.pacscl.org/omeka/s/bjr/page/welcome",
        dateCreated: new Date().toLocaleDateString()
      };

      const existingScrapbook = JSON.parse(localStorage.getItem("operationBlackJoyScrapbook")) || [];
      existingScrapbook.push(postcardData);
      localStorage.setItem("operationBlackJoyScrapbook", JSON.stringify(existingScrapbook));

      alert("✨ Postcard saved! It has been added to your Virtual Scrapbook.");
    });
  }

  // Initial Load Default
  processImageAspect(defaultFallbackImage);
});
