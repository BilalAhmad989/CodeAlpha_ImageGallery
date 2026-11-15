// ---------- Image data ----------
// Replace the `src` values with your own images (e.g. "images/photo1.jpg")
// and edit titles/categories as you like.
const images = [
  { src: "https://picsum.photos/id/1015/1200/800", title: "River Valley", category: "Nature" },
  { src: "https://picsum.photos/id/1018/1200/800", title: "Mountain Range", category: "Nature" },
  { src: "https://picsum.photos/id/1039/1200/800", title: "Waterfall", category: "Nature" },
  { src: "https://picsum.photos/id/1043/1200/800", title: "Forest Trail", category: "Nature" },
  { src: "https://picsum.photos/id/1011/1200/800", title: "Lake Canoe", category: "Travel" },
  { src: "https://picsum.photos/id/1016/1200/800", title: "Canyon Sunset", category: "Travel" },
  { src: "https://picsum.photos/id/1036/1200/800", title: "Snowy Peak", category: "Travel" },
  { src: "https://picsum.photos/id/1040/1200/800", title: "Old Castle", category: "Architecture" },
  { src: "https://picsum.photos/id/1067/1200/800", title: "Ocean Shore", category: "Travel" },
  { src: "https://picsum.photos/id/1074/1200/800", title: "Lion Portrait", category: "Animals" },
  { src: "https://picsum.photos/id/237/1200/800", title: "Black Puppy", category: "Animals" },
  { src: "https://picsum.photos/id/1084/1200/800", title: "Glacier Lake", category: "Nature" },
];

// ---------- Elements ----------
const gallery = document.getElementById("gallery");
const filtersEl = document.getElementById("filters");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCaption = document.getElementById("lbCaption");
const lbCounter = document.getElementById("lbCounter");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

let activeCategory = "All";
let visible = [];      // images currently shown (after filtering)
let currentIndex = 0;  // index inside `visible`

// ---------- Build filter buttons ----------
function buildFilters() {
  const categories = ["All", ...new Set(images.map((i) => i.category))];
  filtersEl.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (cat === activeCategory ? " active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      activeCategory = cat;
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderGallery();
    });
    filtersEl.appendChild(btn);
  });
}

// ---------- Render gallery ----------
function renderGallery() {
  visible = images.filter((img) => activeCategory === "All" || img.category === activeCategory);
  gallery.innerHTML = "";

  visible.forEach((img, index) => {
    const item = document.createElement("div");
    item.className = "item";
    item.tabIndex = 0;
    item.style.animationDelay = `${index * 60}ms`;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Open ${img.title}`);
    item.innerHTML = `
      <img src="${img.src}" alt="${img.title}" loading="lazy" />
      <div class="overlay"><h3>${img.title}</h3><span>${img.category}</span></div>
    `;
    item.addEventListener("click", () => openLightbox(index));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });
    gallery.appendChild(item);
  });
}

// ---------- Lightbox ----------
function showImage(index) {
  currentIndex = (index + visible.length) % visible.length;
  const img = visible[currentIndex];
  lbImg.classList.add("fade");
  setTimeout(() => {
    lbImg.src = img.src;
    lbImg.alt = img.title;
    lbCaption.textContent = `${img.title} · ${img.category}`;
    lbCounter.textContent = `${currentIndex + 1} / ${visible.length}`;
    lbImg.onload = () => lbImg.classList.remove("fade");
    // In case the image is cached and onload does not fire
    if (lbImg.complete) lbImg.classList.remove("fade");
  }, 150);
}

function openLightbox(index) {
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  showImage(index);
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

const nextImage = () => showImage(currentIndex + 1);
const prevImage = () => showImage(currentIndex - 1);

lbClose.addEventListener("click", closeLightbox);
lbNext.addEventListener("click", nextImage);
lbPrev.addEventListener("click", prevImage);

// Click on dark backdrop closes the lightbox
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
});

// Touch swipe support
let touchStartX = 0;
lightbox.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
lightbox.addEventListener("touchend", (e) => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 50) diff < 0 ? nextImage() : prevImage();
}, { passive: true });

// ---------- Init ----------
buildFilters();
renderGallery();
