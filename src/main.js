// main.js
import izitoast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const gallery = document.getElementById("gallery");
const loadingSpinner = document.getElementById("loading-spinner");

const API_KEY = "49228326-f0295c59acbd8047419a0b87e"; // Burada kendi API anahtarınızı kullanın

// Görselleri API'den çekmek için kullanılan fonksiyon
const fetchImages = (searchQuery) => {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.hits) // Arama sonuçlarını döndürür
    .catch((error) => console.error("Error fetching images:", error));
};

// Form submit olayı
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (query === "") return;

  gallery.innerHTML = ""; // Önceki sonuçları temizle
  loadingSpinner.classList.remove("hidden"); // Yükleme göstergesini göster

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
      loadingSpinner.classList.add("hidden"); // Yükleme göstergesini gizle
    });
});

// Görselleri galeriye ekleyen fonksiyon
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

  // SimpleLightbox'ı yenile
  const lightbox = new SimpleLightbox(".gallery-item", {
    captionsData: "alt",
    captionDelay: 250,
  });
  lightbox.refresh();
}
