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

  const clearCertificateHash = () => {
    if (window.location.hash.startsWith("#certificate-")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  const closeCertificate = () => {
    certificateModal.close();
  };

  const openCertificate = (opener, updateHash = true) => {
    certificateReturnFocus = opener;
    const title = opener.dataset.certificateTitle || "Certificate";
    const credentialUrl = opener.dataset.certificateUrl || "";
    const certificateHash = opener.dataset.certificateHash || "";

    modalImage.src = opener.dataset.certificateImage || "";
    modalImage.alt = title + " official certificate";
    modalTitle.textContent = title;
    modalMeta.textContent = opener.dataset.certificateMeta || "";
    modalDescription.textContent = opener.dataset.certificateDescription || "";
    modalLink.hidden = !credentialUrl;
    modalLink.href = credentialUrl;

    certificateModal.showModal();
    document.body.classList.add("has-open-modal");
    if (updateHash && certificateHash) {
      history.replaceState(null, "", "#" + certificateHash);
    }
    modalClose.focus();
  };

  certificateOpeners.forEach((opener) => {
    opener.addEventListener("click", () => openCertificate(opener));
  });

  modalClose.addEventListener("click", closeCertificate);
  certificateModal.addEventListener("click", (event) => {
    if (event.target === certificateModal) {
      closeCertificate();
    }
  });
  certificateModal.addEventListener("close", () => {
    document.body.classList.remove("has-open-modal");
    clearCertificateHash();
    certificateReturnFocus?.focus();
  });

  const openFromHash = () => {
    const certificateHash = window.location.hash.slice(1);
    if (!certificateHash) return;
    const opener = Array.from(certificateOpeners).find(
      (item) => item.dataset.certificateHash === certificateHash
    );
    if (opener && !certificateModal.open) {
      openCertificate(opener, false);
    }
  };

  openFromHash();
  window.addEventListener("hashchange", openFromHash);
}
