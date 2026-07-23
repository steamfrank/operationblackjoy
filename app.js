document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. DOM Element References
  // ==========================================================================
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

  // ==========================================================================
  // 2. Event Selection Modal Logic
  // ==========================================================================
  if (startAppBtn) {
    startAppBtn.addEventListener("click", () => {
      const selectedEvent = document.querySelector('input[name="event-selection"]:checked').value;
      
      if (selectedEvent === "aaam") {
        activeStampPath = "assets/stamp-aaam2026.png";
      } else {
        activeStampPath = "assets/stamp-anyonecanfly.png";
      }
      
      if (selectedStampImg) {
        selectedStampImg.src = activeStampPath;
      }
      
      if (eventModal) {
        eventModal.style.display = "none";
      }
    });
  }

  // ==========================================================================
  // 3. Message Note Character Counter (180 Chars Max)
  // ==========================================================================
  if (messageInput) {
    messageInput.addEventListener("input", (e) => {
      const currentLength = e.target.value.length;
      if (charCount) charCount.textContent = currentLength;
      if (displayMessage) {
        displayMessage.textContent = e.target.value.trim() || "Sending joy & resilience from Operation: Black Joy!";
      }
    });
  }

  // ==========================================================================
  // 4. Flip Card Animation Toggle
  // ==========================================================================
  if (flipBtn && postcard) {
    flipBtn.addEventListener("click", () => {
      postcard.classList.toggle("is-flipped");
    });
  }

  // ==========================================================================
  // 5. Image Aspect Ratio Detection & Resilient Loading
  // ==========================================================================
  function processImageAspect(imgUrl) {
    if (!imgUrl || imgUrl.trim() === "") {
      imgUrl = defaultFallbackImage;
    }

    const tempImg = new Image();
    tempImg.crossOrigin = "anonymous"; // Helps prevent CORS issues with external archive images
    tempImg.src = imgUrl;

    tempImg.onload = () => {
      if (postcardPhoto) postcardPhoto.src = imgUrl;
      const width = tempImg.naturalWidth;
      const height = tempImg.naturalHeight;

      if (cardFrontWrapper) {
        cardFrontWrapper.classList.remove("format-landscape", "format-portrait");

        // Format aspect ratio: Portrait vs Landscape/Square
        if (height > width) {
          cardFrontWrapper.classList.add("format-portrait");
        } else {
          cardFrontWrapper.classList.add("format-landscape");
        }
      }
    };

    tempImg.onerror = () => {
      console.warn("Could not load image at provided URL:", imgUrl);
      if (postcardPhoto) postcardPhoto.src = defaultFallbackImage;
      if (cardFrontWrapper) {
        cardFrontWrapper.classList.remove("format-portrait");
        cardFrontWrapper.classList.add("format-landscape");
      }
    };
  }

  // Update image when URL input changes
  if (archiveUrlInput) {
    archiveUrlInput.addEventListener("input", () => {
      const url = archiveUrlInput.value.trim();
      if (archiveSourceLink) {
        archiveSourceLink.href = url || "https://blackjoy.pacscl.org/omeka/s/bjr/page/welcome";
      }
      processImageAspect(url);
    });
  }

  // Update archive link anchor on page number change
  if (pageNumberInput) {
    pageNumberInput.addEventListener("input", () => {
      const pageNum = pageNumberInput.value || 1;
      const baseUrl = archiveUrlInput ? archiveUrlInput.value.trim() : "https://blackjoy.pacscl.org/omeka/s/bjr/page/welcome";
      
      const updatedUrl = `${baseUrl}#page=${pageNum}`;
      if (archiveSourceLink) {
        archiveSourceLink.href = updatedUrl;
      }
    });
  }

  // Initialize Default Image Format on Load
  if (postcardPhoto) {
    processImageAspect(postcardPhoto.src);
  }

  // ==========================================================================
  // 6. Save Postcard to Virtual Scrapbook (localStorage)
  // ==========================================================================
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

      // Retrieve existing list, push new card, and save back to localStorage
      const existingScrapbook = JSON.parse(localStorage.getItem("operationBlackJoyScrapbook")) || [];
      existingScrapbook.push(postcardData);
      localStorage.setItem("operationBlackJoyScrapbook", JSON.stringify(existingScrapbook));

      alert("✨ Postcard saved! It has been added to your Virtual Scrapbook.");
    });
  }
});
