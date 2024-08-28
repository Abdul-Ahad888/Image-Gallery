document.addEventListener('DOMContentLoaded', () => {
  const UNSPLASH_ACCESS_KEY = '1xvF9XIapVZLyYK8Ca79ycl6PeUFc-gUE6Q-k4GxHAU';

  async function fetchUnsplashImages() {
    try {
      const response = await fetch(`https://api.unsplash.com/photos?client_id=${UNSPLASH_ACCESS_KEY}&per_page=30`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      displayImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  function displayImages(images) {
    const imagesContainer = document.getElementById('image-container');
    if (!imagesContainer) {
      console.error('imagesContainer is null');
      return;
    }

    imagesContainer.innerHTML = '';

    images.forEach((photo, index) => {
      if (index === 6 || index === 12) return;
      const title = photo.description || photo.alt_description || 'No Title';
      const description = photo.alt_description || 'Uncategorized';
      const imageUrl = photo.urls.regular;

      const imageElement = document.createElement('div');
      imageElement.className = 'col-6 col-lg-3';
      imageElement.innerHTML = `
        <figure class="img-container position-relative" style="border: 5px solid black; padding: 10px;">
          <a data-fancybox="gallery" href="${imageUrl}" data-caption="${title}" class="fancybox-link">
            <img src="${photo.urls.small}" alt="${photo.alt_description}" class="w-100 h-100" />
          </a>
          <button class="preview-btn">
            <i class="fa fa-expand"></i>
          </button>
          <button class="save-btn" data-image-url="${imageUrl}">
            <i class="fa fa-heart"></i>
          </button>
          <span class="img-content-hover">
            <h2 class="title">${title}</h2>
            <h3 class="category">${description}</h3>
          </span>
        </figure>
      `;
      imagesContainer.appendChild(imageElement);
    });

    // Load saved favorite states
    loadFavoriteStates();

    // Event listeners
    document.querySelectorAll('.preview-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const anchor = button.previousElementSibling;
        anchor.click();
      });
    });

    document.querySelectorAll('.save-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        toggleFavorite(e.currentTarget);
      });
    });
  }

  function toggleFavorite(button) {
    const imageUrl = button.dataset.imageUrl;
    let savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];

    if (savedImages.includes(imageUrl)) {
      // Remove from favorites
      savedImages = savedImages.filter(url => url !== imageUrl);
      button.classList.remove('saved');
    } else {
      // Add to favorites
      savedImages.push(imageUrl);
      button.classList.add('saved');
    }

    localStorage.setItem('savedImages', JSON.stringify(savedImages));
    showToast(savedImages.includes(imageUrl));
  }

  function loadFavoriteStates() {
    const savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
    document.querySelectorAll('.save-btn').forEach(button => {
      const imageUrl = button.dataset.imageUrl;
      if (savedImages.includes(imageUrl)) {
        button.classList.add('saved');
      } else {
        button.classList.remove('saved');
      }
    });
  }

  function showToast(isAdded) {
    const toastEl = document.getElementById('toast');
    const toastBody = toastEl.querySelector('.toast-body');
    toastBody.textContent = isAdded ? 'Image Added To Favourites' : 'Image Removed From Favourites';
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }

  fetchUnsplashImages();
});
