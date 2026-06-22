const grid = document.querySelector("#certification-grid");
const categoryFilter = document.querySelector("#category-filter");
const emptyState = document.querySelector("#empty-state");
const totalCertificates = document.querySelector("#total-certificates");
const latestYear = document.querySelector("#latest-year");
const issuerCount = document.querySelector("#issuer-count");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll("[data-tab-panel]");

function renderStats() {
  const issuers = new Set(certifications.map((certificate) => certificate.issuer));
  const years = certifications
    .map((certificate) => certificate.date.match(/\b\d{4}\b/)?.[0])
    .map((year) => Number.parseInt(year, 10))
    .filter(Boolean);

  totalCertificates.textContent = certifications.length;
  latestYear.textContent = years.length ? Math.max(...years) : "—";
  issuerCount.textContent = issuers.size;
}

function populateCategories() {
  const categories = [...new Set(certifications.map((certificate) => certificate.category))].sort();

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });
}

function certificateMatches(certificate, selectedCategory) {
  const matchesCategory = selectedCategory === "all" || certificate.category === selectedCategory;

  return matchesCategory;
}

function renderCertificates() {
  const selectedCategory = categoryFilter.value;
  const filteredCertificates = certifications.filter((certificate) =>
    certificateMatches(certificate, selectedCategory)
  );

  grid.innerHTML = "";
  emptyState.hidden = filteredCertificates.length > 0;

  filteredCertificates.forEach((certificate) => {
    const card = document.createElement("article");
    card.className = `certificate-card${certificate.featured ? " certificate-card--featured" : ""}`;
    card.innerHTML = `
      <div class="certificate-card__top">
        <span class="certificate-card__badge">${certificate.featured ? "Featured · " : ""}${certificate.category}</span>
        <span class="certificate-card__date">${certificate.date}</span>
      </div>
      <h3>${certificate.title}</h3>
      <p class="certificate-card__issuer">${certificate.issuer}</p>
      <p class="certificate-card__description">${certificate.description}</p>
      <div class="certificate-card__skills">
        ${certificate.skills.map((skill) => `<span>${skill}</span>`).join("")}
      </div>
      <a class="certificate-card__link" href="${certificate.credentialUrl}" target="_blank" rel="noreferrer">
        View credential
      </a>
    `;
    grid.append(card);
  });
}

function setActiveTab(activeTab) {
  tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === activeTab);
  });

  tabPanels.forEach((panel) => {
    panel.hidden = panel.dataset.tabPanel !== activeTab;
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});

categoryFilter.addEventListener("change", renderCertificates);

renderStats();
populateCategories();
renderCertificates();
