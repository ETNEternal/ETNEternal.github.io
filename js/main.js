// main.js
// Navigation hover effects
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("mouseover", () => {
    link.classList.add("pop-out");
  });
  link.addEventListener("mouseout", () => {
    link.classList.remove("pop-out");
  });
});

// Banner image fade in
window.addEventListener("load", () => {
  const bannerImage = document.getElementById("banner-image");
  if (bannerImage) {
    bannerImage.style.opacity = 0;
    bannerImage.style.transition = "opacity 2s";
    bannerImage.style.opacity = 1;
  }
});

var modal = document.getElementById("imageModal");

// Get the image and insert it inside the modal
var modalImg = document.getElementById("modalImage");
var images = document.querySelectorAll(".our-clubs img, .allied-clubs img");

images.forEach(function (image) {
  image.onclick = function () {
    modal.style.display = "block";
    modalImg.src = this.src;
  };
});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};
// Call setup after page loads
window.addEventListener("load", setupModal);
