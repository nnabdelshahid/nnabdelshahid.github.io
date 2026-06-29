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
