document.addEventListener('DOMContentLoaded', () => {
    const savedImagesContainer = document.getElementById('saved-images-container');
    const deleteAllButton = document.querySelector('#deleteAllBtn');
    const emptyMessage = document.querySelector('.empty-message');
    let imageToDelete = null;
  
    // Function to create an image card
    function createImageCard(url) {
      const imageElement = document.createElement('div');
      imageElement.className = 'col-6 col-lg-3';
      imageElement.innerHTML = `
        <figure class="img-container position-relative" style="border: 5px solid black; padding: 10px;">
          <a data-fancybox="gallery" href="${url}" class="fancybox-link">
            <img src="${url}" alt="Saved Image" class="w-100 h-100" />
          </a>
          <button class="preview-btn">
            <i class="fa fa-expand"></i>
          </button>
          <button class="delete-btn">
            <i class="fa fa-trash"></i>
          </button>
          <span class="img-content-hover"></span>
        </figure>
      `;
      savedImagesContainer.appendChild(imageElement);
    }
  
    // Function to handle empty message visibility
    function emptyMsg() {
      const savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
      emptyMessage.style.display = savedImages.length === 0 ? 'flex' : 'none';
    }
  
    // Load saved images
    const savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
    savedImages.forEach(url => {
      createImageCard(url);
    });
  
    // Initial check for empty message
    emptyMsg();
  
    // Delete buttons
    savedImagesContainer.addEventListener('click', (e) => {
      if (e.target.closest('.delete-btn')) {
        const button = e.target.closest('.delete-btn');
        imageToDelete = button.closest('.col-6');
        const imageUrl = button.previousElementSibling.previousElementSibling.href;
  
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        confirmDeleteBtn.dataset.imageUrl = imageUrl;
  
        // Show confirmation modal
        const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        confirmDeleteModal.show();
      }
    });
  
    // Delete single image
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
      const imageUrl = document.getElementById('confirmDeleteBtn').dataset.imageUrl;
  
      // Remove the image from localStorage
      removeImage(imageUrl);
      if (imageToDelete) {
        imageToDelete.remove();
        imageToDelete = null;
      }
  
      // Hide modal and update UI
      const confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
      confirmDeleteModal.hide();
  
      emptyMsg(); // Update empty message
      updateDeleteAllButtonState();
    });
  
    // Delete all images
    deleteAllButton.addEventListener('click', () => {
      const confirmDeleteAllBtn = document.getElementById('confirmDeleteAllBtn');
      const confirmDeleteAllModal = new bootstrap.Modal(document.getElementById('confirmDeleteAllModal'));
      confirmDeleteAllModal.show();
  
      confirmDeleteAllBtn.addEventListener('click', () => {
        // Clear localStorage and update UI
        localStorage.removeItem('savedImages');
        savedImagesContainer.innerHTML = '';
  
        confirmDeleteAllModal.hide();
  
        emptyMsg(); // Update empty message
        updateDeleteAllButtonState();
      });
    });
  
    // Function to remove image from localStorage
    function removeImage(url) {
      let savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
      savedImages = savedImages.filter(image => image !== url);
      localStorage.setItem('savedImages', JSON.stringify(savedImages));
    }
  
    function updateDeleteAllButtonState() {
      const savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
      deleteAllButton.disabled = savedImages.length === 0;
    }
  
    const previewButtons = document.querySelectorAll('.preview-btn');
    previewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const anchor = button.previousElementSibling;
        anchor.click();
      });
    });
  });