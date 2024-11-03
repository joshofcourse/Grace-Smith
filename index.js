
  // AJAX MODAL POWER-UP
window.addEventListener("DOMContentLoaded", (event) => {
    // Parameterized ajaxmodal component with individual timelines
    function adjaxModal(lightboxSelector, lightboxCloseSelector, lightboxModalSelector, cmsLinkSelector, cmsPageContentSelector, setupTimeline) {
      let lightbox = $(lightboxSelector);
      let lightboxClose = $(lightboxCloseSelector).attr("aria-label", "Close Modal");
      let lightboxModal = $(lightboxModalSelector);
      let cmsLink = cmsLinkSelector;
      let cmsPageContent = cmsPageContentSelector;
      let initialPageTitle = document.title;
      let initialPageUrl = window.location.href;
      let focusedLink;
  
      function updatePageInfo(newTitle, newUrl) {
        lightboxModal.empty();
        document.title = newTitle;
        window.history.replaceState({}, "", newUrl);
      }
  
      // Set up the custom timeline for each instance
      let tl = setupTimeline(gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          focusedLink.focus();
          updatePageInfo(initialPageTitle, initialPageUrl);
        },
        onComplete: () => {
          lightboxClose.focus();
        }
      }), lightbox, lightboxModal);
  
      function keepFocusWithinLightbox() {
        let lastFocusableChild = lightbox
          .find("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")
          .not(":disabled")
          .not("[aria-hidden=true]")
          .last();
        lastFocusableChild.on("focusout", function () {
          lightboxClose.focus();
        });
      }
  
      function lightboxReady() {
        // your code here
      }
  
      $(document).on("click", cmsLink, function (e) {
        focusedLink = $(this);
        initialPageUrl = window.location.href;
        e.preventDefault();
        let linkUrl = $(this).attr("href");
        $.ajax({
          url: linkUrl,
          success: function (response) {
            let cmsContent = $(response).find(cmsPageContent);
            let cmsTitle = $(response).filter("title").text();
            let cmsUrl = window.location.origin + linkUrl;
            updatePageInfo(cmsTitle, cmsUrl);
            lightboxModal.append(cmsContent);
            tl.play();
            keepFocusWithinLightbox();
            lightboxReady();
          }
        });
      });
  
      lightboxClose.on("click", function () {
        tl.reverse();
      });
  
      $(document).on("keydown", function (e) {
        if (e.key === "Escape") tl.reverse();
      });
  
      $(document).on("click", lightbox, function (e) {
        if (!$(e.target).is(lightbox.find("*"))) tl.reverse();
      });
    }
  
    // Initialize the "About" modal with its custom timeline
    adjaxModal(
      "[tr-ajaxmodal-element='lightbox-about']",
      "[tr-ajaxmodal-element='lightbox-close-about']",
      "[tr-ajaxmodal-element='lightbox-modal-about']",
      "[tr-ajaxmodal-element='page-link-about']",
      "[tr-ajaxmodal-element='page-content-about']",
      (tl, lightbox, lightboxModal) => {
        // Customize the timeline for "About" modal
        tl.set("body", { overflow: "hidden" });
        tl.set(lightbox, { display: "flex", onComplete: () => lightboxModal.scrollTop(0) });
        tl.to(".lightbox_about", { backgroundColor: "rgba(0, 0, 0, 0.75)", duration: 1 }, "<");
        tl.from(lightboxModal, { x: "-100%", duration: 1, ease: "power4.inOut" }, "<");
        tl.to(".contents_core", { x: "15rem", duration: 1, ease: "power4.inOut" }, "<");
        tl.to(".hero_heading-split", { width: "30vw", duration: 1, ease: "power4.inOut" }, "<");
        return tl;
      }
    );
  
    // Initialize the "Services" modal with its custom timeline
    adjaxModal(
      "[tr-ajaxmodal-element='lightbox-inquire']",
      "[tr-ajaxmodal-element='lightbox-close-inquire']",
      "[tr-ajaxmodal-element='lightbox-modal-inquire']",
      "[tr-ajaxmodal-element='page-link-inquire']",
      "[tr-ajaxmodal-element='page-content-inquire']",
      (tl, lightbox, lightboxModal) => {
        // Customize the timeline for "Services" modal
        tl.set("body", { overflow: "hidden" });
        tl.set(lightbox, { display: "flex", onComplete: () => lightboxModal.scrollTop(0) });
        tl.to(".lightbox_inquire", { backgroundColor: "rgba(0, 0, 0, 0.75)", duration: 1 }, "<");
        tl.from(lightboxModal, { y: "100%", duration: 1, ease: "power4.inOut" }, "<");
        tl.to(".contents_core", { y: "-15rem", duration: 1, ease: "power4.inOut" }, "<");
        tl.to(".hero_heading-split", { width: "30vw", y: "-4rem", duration: 1, ease: "power4.inOut" }, "<");
        return tl;
      }
    );
  
    /*
    // Initialize the "Contact" modal with its custom timeline
    adjaxModal(
      "[tr-ajaxmodal-element='lightbox-contact']",
      "[tr-ajaxmodal-element='lightbox-close-contact']",
      "[tr-ajaxmodal-element='lightbox-modal-contact']",
      "[tr-ajaxmodal-element='page-link-contact']",
      "[tr-ajaxmodal-element='page-content-contact']",
      (tl, lightbox, lightboxModal) => {
        // Customize the timeline for "Contact" modal
        tl.set("body", { overflow: "hidden" });
        tl.set(lightbox, { display: "block", onComplete: () => lightboxModal.scrollTop(0) });
        tl.from(lightboxModal, { x: "-50%", duration: 1.5, ease: "elastic.out(1, 0.3)" }, "<");
        tl.to(".contents_core", { x: "5rem", duration: 1, ease: "circ.out" }, "<");
        tl.to(".hero_heading-split", { width: "30vw", duration: 1.2, ease: "sine.inOut" }, "<");
        return tl;
      }
    );
    */
  });
