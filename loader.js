document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
  
    // Simulate loading process
    setTimeout(() => {
      loader.classList.add('complete');
  
      // Hide loader after animation is complete
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
      }, 2000);
    }, 100); 
  });
  
  document.addEventListener('beforeunload', () => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '1';
    loader.style.visibility = 'visible';
  });
  