document.addEventListener("DOMContentLoaded", () => {
  const eventModal = document.getElementById("event-modal");
  const startAppBtn = document.getElementById("start-app-btn");
  const selectedStampImg = document.getElementById("selected-stamp");
  
  const postcardPhoto = document.getElementById("postcard-photo");
  const cardFrontWrapper = document.getElementById("card-front-wrapper");
  const imageUploadInput = document.getElementById("image-upload-input");
  const archiveUrlInput = document.getElementById("archive-url-input");
  
  const messageInput = document.getElementById("message-input");
  const charCount = document.getElementById("char-count");
  const displayMessage = document.getElementById("display-message");
  
  const flipBtn = document.getElementById("flip-btn");
  const postcard = document.getElementById("postcard-element");
  const saveScrapbookBtn = document.getElementById("save-scrapbook-btn");
  const archiveSourceLink = document.getElementById("archive-source-link");

  let activeStampPath = "assets/stamp-aaam2026.png";
  const defaultFallbackImage = "assets/default-postcard.png";

  // 1. Modal Setup
  if (startAppBtn) {
    startAppBtn.addEventListener("click", () => {
      const selectedEvent = document.querySelector('input[name="event-selection"]:checked').value;
      activeStampPath = selectedEvent === "aaam" ? "assets/stamp-aaam2026.png" : "assets/stamp-anyonecanfly.png";
      
      if (selectedStampImg) selectedStampImg.src = activeStampPath;
      if (eventModal) eventModal.style.display = "none";
    });
  }

  // 2. Character Counter & Live Note Update
  if (messageInput) {
    messageInput.addEventListener("input", (e) => {
      const currentLength = e.target.value.length;
      if (charCount) charCount.textContent = currentLength;
      if (displayMessage) {
        displayMessage.textContent = e.target.value.trim() || "Sending joy & resilience from Operation: Black Joy!";
      }
    });
  }

  // 3. Flip Toggle
  if (flipBtn && postcard) {
    flipBtn.addEventListener("click", () => {
      postcard.classList.toggle("is-flipped");
    });
  }

  // 4. Image Aspect Ratio & Frame Formatting Helper
  function processImageAspect(imgSrc) {
    const targetUrl = (imgSrc && imgSrc.trim() !== "") ? imgSrc.trim() : defaultFallbackImage;
    
    const tempImg = new Image();
    tempImg.src = targetUrl;

    tempImg.onload = () => {
      if (postcardPhoto) postcardPhoto.src = targetUrl;
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
      if (postcardPhoto) postcardPhoto.src = defaultFallbackImage;
      if (cardFrontWrapper) {
        cardFrontWrapper.classList.remove("format-portrait");
        cardFrontWrapper.classList.add("format-landscape");
      }
    };
  }

  // 5. Direct File Upload Handler (NEW!)
  if (imageUploadInput) {
    imageUploadInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const localImageDataUrl = event.target.result;
          processImageAspect(localImageDataUrl);
          
          // Clear URL input field when file is uploaded
          if (archiveUrlInput) archiveUrlInput.value = "";
        };

        reader.readAsDataURL(file);
      }
    });
  }

  // 6. Live Archive URL Input Handler
  if (archiveUrlInput) {
    archiveUrlInput.addEventListener("input", () => {
      const url = archiveUrlInput.value.trim();
      if (archiveSourceLink) {
        archiveSourceLink.href = url || "https://blackjoy.pacscl.org/omeka/s/bjr/page/welcome";
      }
      if (url) {
        // Clear file input when typing a URL
        if (imageUploadInput) imageUploadInput.value = "";
        processImageAspect(url);
      }
    });
  }

  // 7. Save to Scrapbook
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
