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

  // 1. Modal Event Selection (Fixed Stamp Image Switch)
    if (startAppBtn) {
      startAppBtn.addEventListener("click", () => {
        const selectedRadio = document.querySelector('input[name="event-selection"]:checked');
        const selectedEvent = selectedRadio ? selectedRadio.value : "aaam";
        
        // Select correct stamp path based on radio value
        activeStampPath = (selectedEvent === "sugarhill" || selectedEvent === "anyonecanfly") 
          ? "assets/stamp-anyonecanfly.png" 
          : "assets/stamp-aaam2026.png";
        
        // Force update the visible image element immediately
        if (selectedStampImg) {
          selectedStampImg.src = activeStampPath;
        }
        
        if (eventModal) {
          eventModal.style.display = "none";
        }
      });
    }


  // 2. Handwritten Message & Counter
  if (messageInput) {
    messageInput.addEventListener("input", (e) => {
      const currentLength = e.target.value.length;
      if (charCount) charCount.textContent = currentLength;
      if (displayMessage) {
        displayMessage.textContent = e.target.value.trim() || "Sending joy & resilience from Operation: Black Joy!";
      }
    });
  }

  // 3. Card Flip Handler
  if (flipBtn && postcard) {
    flipBtn.addEventListener("click", () => {
      postcard.classList.toggle("is-flipped");
    });
  }

  // 4. Image Formatting & Aspect Ratio Processor
  function processImageAspect(imgSrc) {
    const photoPlaceholder = document.getElementById("photo-placeholder");
    
    if (!imgSrc) {
      if (postcardPhoto) postcardPhoto.style.display = "none";
      if (photoPlaceholder) photoPlaceholder.style.display = "flex";
      if (cardFrontWrapper) cardFrontWrapper.classList.add("empty-state");
      return;
    }

    const tempImg = new Image();
    tempImg.src = imgSrc;

    tempImg.onload = () => {
      if (postcardPhoto) {
        postcardPhoto.src = imgSrc;
        postcardPhoto.style.display = "block";
      }
      if (photoPlaceholder) photoPlaceholder.style.display = "none";
      if (cardFrontWrapper) cardFrontWrapper.classList.remove("empty-state");

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
  }

  // 5. Input 1: Direct File Upload for Front Photo
  if (imageUploadInput) {
    imageUploadInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          processImageAspect(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 6. Simplified Link Handler for Postcard Back
  if (archiveUrlInput) {
    archiveUrlInput.addEventListener("input", () => {
      const url = archiveUrlInput.value.trim();
      if (archiveSourceLink) {
        archiveSourceLink.href = url || "https://blackjoy.pacscl.org/omeka/s/bjr/page/welcome";
      }
    });
  }

  // 7. Save Postcard to Scrapbook with Validation
  if (saveScrapbookBtn) {
    saveScrapbookBtn.addEventListener("click", () => {
      if (!imageUploadInput.files || imageUploadInput.files.length === 0) {
        alert("Please upload an image file for the front of your postcard!");
        imageUploadInput.focus();
        return;
      }

      if (!archiveUrlInput.value.trim()) {
        alert("Please enter the PACSCL Archive item address for credit attribution!");
        archiveUrlInput.focus();
        return;
      }

      const typedNote = messageInput ? messageInput.value.trim() : "";
      if (!typedNote) {
        alert("Please type a message for your postcard!");
        messageInput.focus();
        return;
      }

      const isPortrait = cardFrontWrapper ? cardFrontWrapper.classList.contains("format-portrait") : false;

      const postcardData = {
        id: Date.now(),
        frontImage: postcardPhoto ? postcardPhoto.src : defaultFallbackImage,
        orientation: isPortrait ? "portrait" : "landscape",
        message: typedNote,
        note: typedNote,
        stamp: activeStampPath,
        archiveUrl: archiveUrlInput.value.trim(),
        dateCreated: new Date().toLocaleDateString()
      };

      const existingScrapbook = JSON.parse(localStorage.getItem("operationBlackJoyScrapbook")) || [];
      existingScrapbook.push(postcardData);
      localStorage.setItem("operationBlackJoyScrapbook", JSON.stringify(existingScrapbook));

      alert("✨ Postcard saved! It has been added to your Virtual Scrapbook.");
    });
  }

  // Initial setup with fallback asset
  processImageAspect(defaultFallbackImage);
});
