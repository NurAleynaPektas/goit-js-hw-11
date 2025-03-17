window.global = window;

import izitoast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const gallery = document.getElementById("gallery");
const loadingSpinner = document.getElementById("loading-spinner");

const API_KEY = "49228326-f0295c59acbd8047419a0b87e";

const fetchImages = (searchQuery) => {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.hits)
    .catch((error) => console.error("Error fetching images:", error));
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (query === "") return;

  gallery.innerHTML = "";
  loadingSpinner.classList.remove("hidden");

  fetchImages(query)
    .then((images) => {
      if (images.length === 0) {
        izitoast.error({
          message:
            "Sorry, there are no images matching your search query. Please try again!",
        });
      } else {
        renderGallery(images);
      }
    })
    .finally(() => {
      loadingSpinner.classList.add("hidden");
    });
});

function renderGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <a href="${largeImageURL}" class="gallery-item">
        <img src="${webformatURL}" alt="${tags}" />
        <div class="info">
          <p>Likes: ${likes}</p>
          <p>Views: ${views}</p>
          <p>Comments: ${comments}</p>
          <p>Downloads: ${downloads}</p>
        </div>
      </a>
    `;
      }
    )
    .join("");

  gallery.innerHTML = markup;

  const lightbox = new window.SimpleLightbox(".gallery-item", {
    captionsData: "alt",
    captionDelay: 250,
  });
  lightbox.refresh();
}
