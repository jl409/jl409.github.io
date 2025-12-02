const canvas = document.getElementById("animation");
const context = canvas.getContext("2d");

// Nombre total de frames
const frameCount = 120; // à adapter à ton animation
const images = [];
let currentFrame = 0;

function preloadImages() {
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = `images/frames/${String(i).padStart(4, '0')}.webp`;
    images.push(img);
  }
}

function updateImage(index) {
  const img = images[index];
  if (!img.complete) return;

  context.clearRect(0, 0, canvas.width, canvas.height);

  // Ratio de l’image
  const imgRatio = img.width / img.height;
  const canvasRatio = canvas.width / canvas.height;

  let renderWidth, renderHeight, offsetX, offsetY;

  if (canvasRatio > imgRatio) {
    // Canvas plus large → ajuster la hauteur
    renderHeight = canvas.height;
    renderWidth = renderHeight * imgRatio;
    offsetX = (canvas.width - renderWidth) / 2;
    offsetY = 0;
  } else {
    // Canvas plus haut → ajuster la largeur
    renderWidth = canvas.width;
    renderHeight = renderWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvas.height - renderHeight) / 2;
  }

  context.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
}


window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const maxScrollTop = document.body.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  if (frameIndex !== currentFrame) {
    currentFrame = frameIndex;
    updateImage(currentFrame);
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateImage(currentFrame);
});

// Démarrage
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
preloadImages();
images[0].onload = () => updateImage(0);
