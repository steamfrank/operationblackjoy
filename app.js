document.addEventListener("DOMContentLoaded", () => {
  // DOM Element References
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

  // 1. EVENT SELECTION MODAL LOGIC
  startAppBtn.addEventListener("click", () => {
    const selectedEvent = document.querySelector('input[name="event-selection"]:checked').value;
    
    if (selectedEvent === "aaam") {
      activeStampPath = "assets/stamp-aaam2026.png";
    } else {
      activeStampPath = "assets/stamp-anyonecanfly.png";
    }
    
    selectedStampImg.src = activeStampPath;
    eventModal.style.display = "none"; // Close modal
  });

  // 2. CHARACTER COUNTER FOR MESSAGE (MAX 180 CHARS)
  messageInput.addEventListener("input", (e) => {
    const currentLength = e.target.value.length;
    charCount.textContent = currentLength;
    displayMessage.textContent = e.target.value.trim() || "Sending joy & resilience from Operation: Black Joy!";
  });

  // 3. FLIP CARD TOGGLE
  flipBtn.addEventListener("click", () => {
    postcard.classList.toggle("is-flipped");
  });

  // 4. ASPECT RATIO & IMAGE LOADING
  function processImageAspect(imgUrl) {
    const tempImg = new Image();
    tempImg.src = imgUrl;

    tempImg.onload = () => {
      postcardPhoto.src = imgUrl;
      const width = tempImg.naturalWidth;
      const height = tempImg.naturalHeight;

      // Reset format classes
      cardFrontWrapper.classList.remove("format-landscape", "format-portrait");

      // Determine orientation
      if (height > width) {
        // Portrait
        cardFrontWrapper.classList.add("format-portrait");
      } else {
        // Landscape or Square (gets border frame)
        cardFrontWrapper.classList.add("format-landscape");
      }
    };

    tempImg.onerror = () => {
      postcardPhoto.src = "assets/default-postcard.png";
      cardFrontWrapper.classList.add("format-landscape");
    };
  }

  // Handle URL / Page # inputs
  archiveUrlInput.addEventListener("input", () => {
    const url = archiveUrlInput.value.trim() || "assets/default-postcard.png";
    archiveSourceLink.href = url;
    processImageAspect(url);
  });

  pageNumberInput.addEventListener("input", () => {
    const pageNum = pageNumberInput.value || 1;
    // Map page numbers or update link query parameters
    const updatedUrl = `https://blackjoy.pacscl.org/omeka/s/bjr/page/welcome#page=${pageNum}`;
    archiveSourceLink.href = updatedUrl;
  });

  // Initialize Default Image Format
  processImageAspect(postcardPhoto.src);

  // 5. SAVE TO SCRAPBOOK (WITH FRONT QR CODE DATA)
  if (saveScrapbookBtn) {
    saveScrapbookBtn.addEventListener("click", () => {
      const postcardData = {
        id: Date.now(),
        frontImage: postcardPhoto.src,
        orientation: cardFrontWrapper.classList.contains("format-portrait") ? "portrait" : "landscape",
        message: displayMessage.textContent,
        stamp: activeStampPath,
        archiveUrl: archiveSourceLink.href,
        dateCreated: new Date().toLocaleDateString()
      };

      const existingScrapbook = JSON.parse(localStorage.getItem("operationBlackJoyScrapbook")) || [];
      existingScrapbook.push(postcardData);
      localStorage.setItem("operationBlackJoyScrapbook", JSON.stringify(existingScrapbook));

      alert("Postcard saved! It has been added to the Virtual Scrapbook gallery.");
    });
  }
});
