const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const year = document.querySelector("#year");
const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-form-status");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menu && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (header) {
  const updateHeader = () => {
    header.classList.toggle("site-header--scrolled", window.scrollY > 10);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (contactForm && contactStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    contactStatus.textContent = "Sending...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("Message failed");
      }

      contactForm.reset();
      contactStatus.textContent = "Thanks. Your message was sent.";
    } catch (error) {
      contactStatus.textContent = "The form could not send right now. Please email NNAbdelshahid@gmail.com directly.";
    }
  });
}
