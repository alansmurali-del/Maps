// Initialize MapLibre map
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [77.5946, 12.9716], // Bangalore coordinates
  zoom: 10
});

// Add navigation controls
map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

let marker = null;

// Easter egg modal
const easterEggModal = document.getElementById('easter-egg-modal');
const closeBtn = document.getElementById('close-easter-egg');
const aryaImage = document.getElementById('arya-image');

// Close Easter egg modal
if (closeBtn) {
  closeBtn.addEventListener('click', function() {
    easterEggModal.style.display = 'none';
  });
}

// Close modal when clicking outside the image
window.addEventListener('click', function(event) {
  if (event.target === easterEggModal) {
    easterEggModal.style.display = 'none';
  }
});

// Blink animation function
function startBlinkAnimation() {
  if (aryaImage) {
    // Blink every 3 seconds
    setInterval(() => {
      aryaImage.classList.add('blink');
      setTimeout(() => {
        aryaImage.classList.remove('blink');
      }, 200);
    }, 3000);
  }
}

// Search place function
async function searchPlace() {
  const q = document.getElementById('search').value.trim();
  
  // Easter egg: Search for "Arya"
  if (q.toLowerCase() === 'arya') {
    if (easterEggModal) {
      easterEggModal.style.display = 'flex';
      // Trigger animations
      if (aryaImage) {
        aryaImage.classList.remove('blink');
        aryaImage.classList.add('animate-entrance');
        setTimeout(() => {
          startBlinkAnimation();
        }, 500);
      }
    }
    return;
  }
  
  if (!q) {
    document.getElementById('card').innerHTML = '<div class="card-content"><p class="card-text">🔍 Please enter a place name</p></div>';
    return;
  }

  // Show loading state
  document.getElementById('card').innerHTML = '<div class="card-content"><p class="card-text">⏳ Searching...</p></div>';

  try {
    const response = await fetch(
      'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + 
      encodeURIComponent(q)
    );
    const data = await response.json();

    if (!data.length) {
      document.getElementById('card').innerHTML = '<div class="card-content"><p class="card-text">❌ Place not found. Try another search.</p></div>';
      return;
    }

    const place = data[0];
    const lng = parseFloat(place.lon);
    const lat = parseFloat(place.lat);

    // Fly to location
    map.flyTo({
      center: [lng, lat],
      zoom: 13,
      duration: 1500
    });

    // Remove old marker and add new one
    if (marker) marker.remove();
    marker = new maplibregl.Marker({
      color: '#1a73e8'
    })
      .setLngLat([lng, lat])
      .addTo(map);

    // Update info card
    document.getElementById('card').innerHTML = 
      '<div class="card-content">' +
      '<b>📍 ' + place.name + '</b>' +
      '<p class="card-text">' + place.display_name + '</p>' +
      '</div>';

  } catch (error) {
    document.getElementById('card').innerHTML = '<div class="card-content"><p class="card-text">⚠️ Error searching place. Try again.</p></div>';
    console.error('Search error:', error);
  }
}

// Event listeners
document.getElementById('go').addEventListener('click', searchPlace);
document.getElementById('search').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    searchPlace();
  }
});