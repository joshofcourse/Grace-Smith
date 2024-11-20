// #region AJAX MODALS

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
      let items = $(cmsLink).parent();  // All CMS items for cycling
      let activeIndex = 0; // Initialize the index to the first item in the list
  
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
  
      function setModalContent(item) {
          let linkUrl = item.attr("href");
          $.ajax({
              url: linkUrl,
              success: function (response) {
                  let cmsContent = $(response).find(cmsPageContent);
                  let cmsTitle = $(response).filter("title").text();
                  let cmsUrl = window.location.origin + linkUrl;
                  updatePageInfo(cmsTitle, cmsUrl);
                  lightboxModal.empty().append(cmsContent);
                  tl.play();
                  keepFocusWithinLightbox();
              },
          });
      }

  
      $(document).on("click", cmsLink, function (e) {
          focusedLink = $(this);
          initialPageUrl = window.location.href;
          e.preventDefault();
          activeIndex = items.index($(this).parent()); // Set activeIndex to the clicked item
          setModalContent($(this));
      });
  
      function addNavigation() {
          lightbox.on("click", ".story-next", function () {
              // Increment activeIndex and loop back if necessary
              activeIndex = (activeIndex + 1) % items.length;
              let nextItem = items.eq(activeIndex).find(cmsLink);
              setModalContent(nextItem);
          });
  
          lightbox.on("click", ".story-prev", function () {
              // Decrement activeIndex and loop to the end if necessary
              activeIndex = (activeIndex - 1 + items.length) % items.length;
              let prevItem = items.eq(activeIndex).find(cmsLink);
              setModalContent(prevItem);
          });
      }

  
  
      if (lightboxSelector === "[tr-ajaxmodal-element='lightbox-story']") {
          addNavigation();
      }
  
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
        // Detect if mobile
        const isMobile = window.innerWidth <= 768; // Set breakpoint for mobile
    
        // Customize the timeline for mobile
        if (isMobile) {
            tl.set("body", { overflow: "hidden" });
            tl.set(lightbox, { display: "flex", onComplete: () => lightboxModal.scrollTop(0) });
            tl.to(".lightbox_about", { backgroundColor: "rgba(0, 0, 0, 0.75)", duration: 1 }, "<")
            tl.from(lightboxModal, { y: "100%", duration: 1, ease: "power4.inOut" }, "<");
            tl.from(".about_close-wrapper", { y: "-20%", opacity: 0, duration: 0.75, ease: "power4.out", delay: 0.75 }, "<");
        } else {
            // Original animation settings for desktop
            tl.set("body", { overflow: "hidden" });
            tl.set(lightbox, { display: "flex", onComplete: () => lightboxModal.scrollTop(0) });
            tl.to(".lightbox_about", { backgroundColor: "rgba(0, 0, 0, 0.75)", duration: 1 }, "<");
            tl.from(lightboxModal, { x: "-100%", duration: 1, ease: "power4.inOut" }, "<");
            tl.to(".contents_core", { x: "15%", duration: 1, ease: "power4.inOut" }, "<");
            tl.fromTo(".hero_heading-wrap", { width: "100%"}, { width: "60%", duration: 1, ease: "power4.inOut" },  "<");
            tl.from(".about_close-wrapper", { x: "5%", opacity: 0, duration: 0.75, ease: "power4.out", delay: 0.75 }, "<");
        }
    
        return tl;
    }
  );

  // Initialize the "Story" modal with its custom timeline and next/previous navigation
  adjaxModal(
      "[tr-ajaxmodal-element='lightbox-story']",
      "[tr-ajaxmodal-element='lightbox-close-story']",
      "[tr-ajaxmodal-element='lightbox-modal-story']",
      "[tr-ajaxmodal-element='page-link-story']",
      "[tr-ajaxmodal-element='page-content-story']",
      (tl, lightbox, lightboxModal) => {
        // Detect if mobile
        const isMobile = window.innerWidth <= 768; // Set breakpoint for mobile

          // Customize the timeline for "Story" modal
          if (isMobile) {

          tl.set("body", { overflow: "hidden" });
          tl.set(lightbox, { display: "flex", onComplete: () => lightboxModal.scrollTop(0) });
          tl.to(".lightbox_story", { backgroundColor: "rgba(0, 0, 0, 0.75)", duration: 1 }, "<");
          tl.from(lightboxModal, { y: "100%", duration: 1, ease: "power4.inOut" }, "<");
          tl.from(".story_close-wrapper", { y: "-20%", opacity: 0, duration: 0.75, ease: "power4.out", delay: 0.75 }, "<");

          } else {

            tl.set("body", { overflow: "hidden" });
            tl.set(lightbox, { display: "flex", onComplete: () => lightboxModal.scrollTop(0) });
            tl.to(".lightbox_story", { backgroundColor: "rgba(0, 0, 0, 0.75)", duration: 1 }, "<");
            tl.from(lightboxModal, { x: "100%", duration: 1, ease: "power4.inOut" }, "<");
            tl.to(".contents_core", { x: "-15%", duration: 1, ease: "power4.inOut" }, "<");
            tl.to(".hero_heading-split", { width: "30vw", duration: 1, ease: "power4.inOut" }, "<");
            tl.from(".story_close-wrapper", { x: "-5%", opacity: 0, duration: 0.75, ease: "power4.out", delay: 0.75 }, "<");

          }
          return tl;
      }
  );
});

// #endregion
// ----------------------------------------------------------
// #region Inquire Modal

$(document).ready(function () {
  // Create a GSAP timeline for the lightbox with initial hidden state
  const lightboxTimeline = gsap.timeline({
    paused: true,
    reversed: true,
    onStart: () => {
      $("body").css("overflow", "hidden"); // Disable body scrolling

      // Add a short delay to ensure content is fully visible before resetting scroll
      setTimeout(() => $(".lightbox_inquire-modal").scrollTop(0), 10); 
    },
    onReverseComplete: () => $("body").css("overflow", "") // Re-enable body scrolling
  })
  .to(".lightbox_inquire", { display: "flex" })
  .to(".lightbox_inquire", { backgroundColor: "rgba(0, 0, 0, 0.75)", duration: 1 }, "<")
  .from(".lightbox_inquire-modal", { y: "100%", duration: 1, ease: "power4.inOut" }, "<")
  .from(".inquire_close-wrapper", { y: "-20%", opacity: 0, duration: 0.75, ease: "power4.out", delay: 0.75 }, "<");

  // Toggle animation on button click
  $("[inquire-modal='open']").on("click", function () {
    lightboxTimeline.reversed() ? lightboxTimeline.play() : lightboxTimeline.reverse();
  });

  // Reverse animation on close button click
  $("[inquire-modal='close']").on("click", function () {
    lightboxTimeline.reverse();
  });
});




// #endregion
// ----------------------------------------------------------
// #region Nav color changes 


// Navbar Logo Change
  $("[is-light='true']").each(function (index) {
    ScrollTrigger.create({
      trigger: $(this),
      start: "top 10%",
      end: "bottom 10%",
      onEnter: () => {
        $(".logo_bar").addClass("dark");
      },
      onEnterBack: () => {
        $(".logo_bar").addClass("dark");
      }
    });
  });
  
  $("[is-light='false']").each(function (index) {
    ScrollTrigger.create({
      trigger: $(this),
      start: "top 10%",
      end: "bottom 10%",
      onEnter: () => {
        $(".logo_bar").removeClass("dark");
      },
      onEnterBack: () => {
        $(".logo_bar").removeClass("dark");
      }
    });
  });

// Navbar Button Change
  $("[is-light='true']").each(function (index) {
    ScrollTrigger.create({
      trigger: $(this),
      start: "top 90%",
      end: "bottom 90%",
      onEnter: () => {
        $(".navbar-inner .btn-blur").addClass("dark");
      },
      onEnterBack: () => {
        $(".navbar-inner .btn-blur").addClass("dark");
      }
    });
  });
  
  $("[is-light='false']").each(function (index) {
    ScrollTrigger.create({
      trigger: $(this),
      start: "top 90%",
      end: "bottom 90%",
      onEnter: () => {
        $(".navbar-inner .btn-blur").removeClass("dark");
      },
      onEnterBack: () => {
        $(".navbar-inner .btn-blur").removeClass("dark");
      }
    });
  }); 

  // #endregion
// ----------------------------------------------------------
// #region Scroll Animations



//---------------------------------------------------------------------------------------------------------
// Desktop Only

$(document).ready(function () {
  // Define each function call only if screen is above 768px
  function aboveTablet() {
      storyParaDown();
  }

  // Set up a media query list for (min-width: 768px)
  const mediaQuery = window.matchMedia("(min-width: 992px)");

  // Initial check to run functions if already above 768px on page load
  if (mediaQuery.matches) {
    aboveTablet();
  }

  // Listen for changes in viewport width to rerun functions if needed
  mediaQuery.addEventListener("change", function (event) {
      if (event.matches) {
          // The screen width is above 768px
          aboveTablet();
      }
  });
});

//---------------------------------------------------------------------------------------------------------
// Mobile Only

$(document).ready(function () {
  // Define each function call only if screen is above 768px
  function mobileOnly() {
      heroTitleMobile()
  }

  const mediaQuery = window.matchMedia("(max-width: 479px)");

  if (mediaQuery.matches) {
    mobileOnly();
  }

  mediaQuery.addEventListener("change", function (event) {
      if (event.matches) {
          mobileOnly();
      }
  });
});

//---------------------------------------------------------------------------------------------------------
// Desktop & Tablet & Mobile
$(document).ready(function () {
      letterFade();
      staggerFade();
});

//---------------------------------------------------------------------------------------------------------
// Desktop & Tablet
$(document).ready(function () {
  // Define each function call only if screen is above 768px
  function aboveMobile() {
      wipeReveal();
      storyCloseImage();
      heroTitle();
      gsAbout();
      storyParaUp();
      footerPara();
  }

  // Set up a media query list for (min-width: 768px)
  const mediaQuery = window.matchMedia("(min-width: 768px)");

  // Initial check to run functions if already above 768px on page load
  if (mediaQuery.matches) {
    aboveMobile();
  }

  // Listen for changes in viewport width to rerun functions if needed
  mediaQuery.addEventListener("change", function (event) {
      if (event.matches) {
          // The screen width is above 768px
          aboveMobile();
      }
  });
});

// #region Testimonial Image Slides
// ______ Wipe Reveal Items
function wipeReveal() {
  $(".testi_media").each(function (index) {
    let triggerElement = $(this);
    let targetElement = $(".testi_img-wrap");
    let innerImage = $(".testi-image");
    let lionElement = $(".testi_lioness");

    let wipeReveal = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "top bottom",
        end: "top, 80%",
        toggleActions: "none play none reset",
      },
    });
    wipeReveal.from($(this).find(targetElement), {
      x: "-102%",
      duration: 2,
      ease: "power4.inOut",
    });
    wipeReveal.from($(this).find(innerImage), {
      scale: 1.3,
      duration: 2,
      ease: "power4.inOut",
    },
    "<"
    );
    wipeReveal.to($(this).find(lionElement), {
      x: "6rem",
      opacity: 0,
      duration: 2,
      ease: "power4.inOut",
    },
    "<"
    );
  });
}

// #endregion

// #region Story bottom Image parallax

function storyCloseImage() {
  $(".story_closing-img").each(function (index) {
    let storyCloseOuter = $(this);
    let storyCloseInner = $(".story_closing-image");

    let storyCloseImage = gsap.timeline({
      scrollTrigger: {
        trigger: storyCloseOuter,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 0.75,
      },
    });
    storyCloseImage.fromTo(
      $(this),
      { width: "10%" },
      { width: "100%", ease: "none" }
    );
    storyCloseImage.fromTo(
      $(this).find(storyCloseInner),
      { scale: 1.3 },
      { scale: 1, ease: "none" },
      "<"
    );
  });
}

// #endregion

// #region Hero GS Para

// Desktop
function heroTitle() {
  $(".hero_section").each(function (index) {
    let heroTitleOuter = $(this);
    let heroTitleInner = $(".hero_heading-split");
    let heroContent = $(".hero_content");
    let logoBar = $(".logo_bar");

    let heroTitle = gsap.timeline({
      scrollTrigger: {
        trigger: heroTitleOuter,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      },
    });
    heroTitle.fromTo(
      $(this).find(heroTitleInner),
      { width: "80%" },
      { width: "60%" }
    );
    heroTitle.to(
      $(this).find(heroContent),
      { y: "50%", opacity: 0, filter: "blur(2px)" },
      "<",
    );
    heroTitle.fromTo($(logoBar),
      { 
        opacity: 0,
        width: "90%",
        filter: "blur(3px)" 
      }, {
        opacity: 1,
        width: "100%",
        filter: "blur(0px)" 
      }
    );
  });
}

// Mobile
function heroTitleMobile() {
  $(".hero_section").each(function (index) {
    let heroTitleOuter = $(this);
    let heroTitleInner = $(".hero_heading-split");
    let heroContent = $(".hero_content");
    let logoBar = $(".logo_bar");

    let heroTitle = gsap.timeline({
      scrollTrigger: {
        trigger: heroTitleOuter,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      },
    });
  
    heroTitle.to(
      $(this).find(heroContent),
      { y: "30vh", opacity: 0, filter: "blur(2px)" },
      "<",
    );
    heroTitle.fromTo($(logoBar),
      { 
        opacity: 0,
        filter: "blur(3px)" 
      }, {
        opacity: 1,
        filter: "blur(0px)" 
      }
    );
  });
}

// #endregion

// #region Footer Parallax

function footerPara() {
  $(".page_contents").each(function (index) {
    let page = $(this);
    let footer = $(".footer");

    let footerPara = gsap.timeline({
      scrollTrigger: {
        trigger: page,
        start: "bottom bottom",
        end: "bottom top",
        scrub: 0 
      },
    });

    footerPara.from($(footer), {
      y: "-20svh"
      
    });
  });
}

// #endregion

// #region GS About Image

function gsAbout() {
  $(".grace_four-inner").each(function (index) {
    let gsAbout = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top bottom",
        end: "bottom top",
        scrub: 0,
      }
    });
    gsAbout.fromTo($(this), {
      width: "75%"
    }, {
      width: "100%"
    }
    )
  })
}


// #endregion

// #region Fade Heading Animations

function letterFade() {

let splitType = new SplitType("[text-split]", {
  types: "words, chars",
  tagName: "span"
});

$("[letter-fade]").each(function (index) {
  let childLetters = $(this).find(".char");
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: $(this),
      start: "top bottom",
      end: "top 90%",
      toggleActions: "none play none reset"
    }
  });
  // Staggered letter fade
  tl.from($(this).find(".char"), {
    opacity: 0,
    duration: 1,
    y: "100%",
    stagger: {amount: 0.5,}
  });
  tl.from($(this), { 
    filter: "blur(4px)",
    scale: 1.1, 
    duration: 1.5 
  }, 0);

  // Random letters fade
  /*
  childLetters.each(function (index) {
    let randomDuration = gsap.utils.random(4, totalDuration);
    let maxDelay = totalDuration - randomDuration;
    let randomDelay = gsap.utils.random(0, maxDelay);
    tl.from($(this), { opacity: 0, duration: randomDuration }, randomDelay);
  });
  tl.from($(this), { scale: 1.1, ease: "power4.out", filter: "blur(4px)", duration: totalDuration }, 0);
  */

});
}

// #endregion

// #region story Parallax images

function storyParaDown() {
  $("[para-img-down='trigger']").each(function (index) {
    let paraImageTrigger = $(this);

    let storyParaDown = gsap.timeline({
      scrollTrigger: {
        trigger: paraImageTrigger,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        ease: "none",
      },
    });
    storyParaDown.fromTo(
      $(this), {
        y: "0%"
      }, {
        y: "30%"
      }
    )
  });
}

function storyParaUp() {
  $("[para-img-up='trigger']").each(function (index) {
    let paraImageTrigger = $(this);
    let paraImage = $(this).find("[para-img-up='image']");

    let storyParaUp = gsap.timeline({
      scrollTrigger: {
        trigger: paraImageTrigger,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        ease: "none",
      },
    });
    storyParaUp.fromTo(
      $(this).find(paraImage), {
        scale: 1
      }, {
        scale: 1.2
      }
    )
  });
}


// #endregion

// #region Stagger Fade Content

function staggerFade() {
  $("[stagger-fade='trigger']").each(function (index) {
    let triggerElement = $(this);
    let targetElement = $("[stagger-fade='item']");

    let staggerFade = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "top bottom",
        end: "top, 70%",
        toggleActions: "none play none reset",
      },
    });
    staggerFade.from($(this).find(targetElement), {
      y: "4rem",
      opacity: 0,
      duration: 2,
      ease: "power4.out",
      stagger: { amount: 0.5 },
    });
  });
}

// #endregion


// #endregion


