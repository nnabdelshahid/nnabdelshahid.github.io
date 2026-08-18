const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const year = document.querySelector("#year");

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

const projectStack = document.querySelector(".project-stack");
const hasAslProject = projectStack && projectStack.querySelector("[data-project='asl-communication-aid']");

if (projectStack && !hasAslProject) {
  const aslProject = document.createElement("article");
  aslProject.className = "project-card";
  aslProject.dataset.project = "asl-communication-aid";
  aslProject.innerHTML = `
    <img src="images/portfolio/gallery/g-LEARN.jpg" alt="ASL Communication Aid project preview" loading="lazy">
    <div>
      <h3>ASL Communication Aid</h3>
      <p>Accessible communication demo for ASL practice, camera recognition, and speech-ready text.</p>
      <a href="https://nnabdelshahid.github.io/asl-communication-aid/" target="_blank" rel="noopener">Live demo</a>
    </div>
  `;
  projectStack.appendChild(aslProject);
}


const certificateModal = document.querySelector("[data-certificate-modal]");
const certificateOpeners = document.querySelectorAll("[data-certificate-open]");
let certificateReturnFocus = null;

if (certificateModal && certificateOpeners.length) {
  const modalImage = certificateModal.querySelector("[data-certificate-image]");
  const modalTitle = certificateModal.querySelector("[data-certificate-title]");
  const modalMeta = certificateModal.querySelector("[data-certificate-meta]");
  const modalDescription = certificateModal.querySelector("[data-certificate-description]");
  const modalLink = certificateModal.querySelector("[data-certificate-link]");
  const modalClose = certificateModal.querySelector("[data-certificate-close]");

  const closeCertificate = () => {
    certificateModal.close();
    document.body.classList.remove("has-open-modal");
    certificateReturnFocus?.focus();
  };

  certificateOpeners.forEach((opener) => {
    opener.addEventListener("click", () => {
      certificateReturnFocus = opener;
      const title = opener.dataset.certificateTitle || "Certificate";
      const credentialUrl = opener.dataset.certificateUrl || "";

      modalImage.src = opener.dataset.certificateImage || "";
      modalImage.alt = title + " credential badge";
      modalTitle.textContent = title;
      modalMeta.textContent = opener.dataset.certificateMeta || "";
      modalDescription.textContent = opener.dataset.certificateDescription || "";
      modalLink.hidden = !credentialUrl;
      modalLink.href = credentialUrl;

      certificateModal.showModal();
      document.body.classList.add("has-open-modal");
      modalClose.focus();
    });
  });

  modalClose.addEventListener("click", closeCertificate);
  certificateModal.addEventListener("click", (event) => {
    if (event.target === certificateModal) {
      closeCertificate();
    }
  });
  certificateModal.addEventListener("close", () => {
    document.body.classList.remove("has-open-modal");
  });
}
