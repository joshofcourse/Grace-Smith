
// AJAX MODAL POWER-UP
window.addEventListener("DOMContentLoaded", (event) => {
  // ajaxmodal component
  function adjaxModal() {
    let lightbox = $("[tr-ajaxmodal-element='lightbox']");
    let lightboxClose = $("[tr-ajaxmodal-element='lightbox-close']").attr(
      "aria-label",
      "Close Modal"
    );
    let lightboxModal = $("[tr-ajaxmodal-element='lightbox-modal']");
    let cmsLink = "[tr-ajaxmodal-element='cms-link']";
    let cmsPageContent = "[tr-ajaxmodal-element='cms-page-content']";
    let initialPageTitle = document.title;
    let initialPageUrl = window.location.href;
    let focusedLink;
    let items = $(cmsLink).parent();
    let activeItem;

    function updatePageInfo(newTitle, newUrl) {
      lightboxModal.empty();
      document.title = newTitle;
      window.history.replaceState({}, "", newUrl);
    }

    let tl = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        focusedLink.focus();
        updatePageInfo(initialPageTitle, initialPageUrl);
      },
      onComplete: () => {
        lightboxClose.focus();
      },
    });
    tl.set("body", { overflow: "hidden" });
    tl.set(lightbox, {
      display: "block",
      onComplete: () => lightboxModal.scrollTop(0),
    });
    tl.from(lightbox, { opacity: 0, duration: 0.2 });
    tl.from(lightboxModal, { y: "5em", duration: 0.2 }, "<");

    function keepFocusWithinLightbox() {
      let lastFocusableChild = lightbox
        .find(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        )
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

    function setModalContent(item) {
      activeItem = item.parent();
      focusedLink = $(this);
      let linkUrl = item.attr("href");
      $.ajax({
        url: linkUrl,
        success: function (response) {
          let cmsContent = $(response).find(cmsPageContent);
          let cmsTitle = $(response).filter("title").text();
          let cmsUrl = window.location.origin + linkUrl;
          updatePageInfo(cmsTitle, cmsUrl);
          lightboxModal.empty();
          lightboxModal.append(cmsContent);
          tl.play();
          keepFocusWithinLightbox();
          lightboxReady();
        },
      });
    }

    $(document).on("click", cmsLink, function (e) {
      initialPageUrl = window.location.href;
      e.preventDefault();
      setModalContent($(this));
    });

    $(document).on("click", ".next-button", function (e) {
      console.log("ran");
      let item = activeItem.next();
      if (item.length === 0) item = items.first();
      item = item.find(cmsLink);
      setModalContent(item);
    });

    $(document).on("click", ".prev-button", function (e) {
      let item = activeItem.prev();
      if (item.length === 0) item = items.last();
      item = item.find(cmsLink);
      setModalContent(item);
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
  adjaxModal();
});

