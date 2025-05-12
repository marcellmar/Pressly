// Pressly MVP JavaScript

document.addEventListener('DOMContentLoaded', function() {
  console.log("Main.js loaded");
  
  // Initialize demo data in localStorage if none exists
  initializeDemoData();
  
  // Mobile menu toggle
  const navLinks = document.querySelector('.nav-links');
  const mobileMenuToggle = document.createElement('button');
  mobileMenuToggle.classList.add('mobile-menu-toggle');
  mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  
  const header = document.querySelector('header .container');
  if (header) {
    header.appendChild(mobileMenuToggle);
    
    mobileMenuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
  
  // Flash message dismissal
  const flashMessages = document.querySelectorAll('.flash');
  flashMessages.forEach(function(flash) {
    const dismissBtn = document.createElement('button');
    dismissBtn.classList.add('flash-dismiss');
    dismissBtn.innerHTML = '&times;';
    flash.appendChild(dismissBtn);
    
    dismissBtn.addEventListener('click', function() {
      flash.style.display = 'none';
    });
    
    // Auto-dismiss after 5 seconds
    setTimeout(function() {
      flash.style.display = 'none';
    }, 5000);
  });
  
  // Design form - display preview
  const designForm = document.getElementById('design-form');
  if (designForm) {
    const previewContainer = document.getElementById('design-preview');
    const titleInput = document.getElementById('design-title');
    const descriptionInput = document.getElementById('design-description');
    const fileInput = document.getElementById('design-file');
    
    [titleInput, descriptionInput].forEach(function(input) {
      if (input) {
        input.addEventListener('input', updatePreview);
      }
    });
    
    if (fileInput) {
      fileInput.addEventListener('change', updatePreview);
    }
    
    function updatePreview() {
      if (!previewContainer) return;
      
      const title = titleInput ? titleInput.value : 'Design Title';
      const description = descriptionInput ? descriptionInput.value : 'Design Description';
      
      let filePreview = `<div class="placeholder-image">Design Preview</div>`;
      
      // If file is selected, show preview for image files
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const fileName = file.name.toLowerCase();
        
        if (fileName.match(/\.(jpeg|jpg|png|gif)$/)) {
          const reader = new FileReader();
          
          reader.onload = function(e) {
            const previewImageDiv = previewContainer.querySelector('.design-preview-image');
            if (previewImageDiv) {
              previewImageDiv.innerHTML = `
                <img src="${e.target.result}" alt="${title}" class="design-thumbnail">
              `;
            }
          };
          
          reader.readAsDataURL(file);
          filePreview = '<div class="loading-preview">Loading preview...</div>';
        } else {
          // For non-image files, show an icon
          filePreview = `
            <div class="file-icon">
              <i class="fas fa-file"></i>
              <span>${file.name}</span>
            </div>
          `;
        }
      }
      
      previewContainer.innerHTML = `
        <div class="card">
          <div class="design-preview-image">
            ${filePreview}
          </div>
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
      `;
    }
    
    // Initialize preview
    if (previewContainer) {
      updatePreview();
    }
  }
  
  // Design filter functionality
  const designFilter = document.getElementById('design-filter');
  const designSearch = document.getElementById('design-search');
  const designCards = document.querySelectorAll('.design-card');
  
  if (designFilter && designCards.length > 0) {
    designFilter.addEventListener('change', filterDesigns);
  }
  
  if (designSearch && designCards.length > 0) {
    designSearch.addEventListener('input', filterDesigns);
  }
  
  function filterDesigns() {
    const filterValue = designFilter ? designFilter.value : 'all';
    const searchValue = designSearch ? designSearch.value.toLowerCase() : '';
    
    designCards.forEach(function(card) {
      const category = card.dataset.category;
      const title = card.querySelector('.design-title').textContent.toLowerCase();
      const description = card.querySelector('.design-description').textContent.toLowerCase();
      
      const matchesFilter = filterValue === 'all' || category === filterValue;
      const matchesSearch = !searchValue || title.includes(searchValue) || description.includes(searchValue);
      
      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
  
  // Producer filter functionality
  const capabilityFilter = document.getElementById('capability-filter');
  const locationFilter = document.getElementById('location-filter');
  const producerSearch = document.getElementById('producer-search');
  const producerCards = document.querySelectorAll('.producer-card');
  
  if ((capabilityFilter || locationFilter || producerSearch) && producerCards.length > 0) {
    if (capabilityFilter) capabilityFilter.addEventListener('change', filterProducers);
    if (locationFilter) locationFilter.addEventListener('change', filterProducers);
    if (producerSearch) producerSearch.addEventListener('input', filterProducers);
  }
  
  function filterProducers() {
    const capabilityValue = capabilityFilter ? capabilityFilter.value : 'all';
    const locationValue = locationFilter ? locationFilter.value : 'all';
    const searchValue = producerSearch ? producerSearch.value.toLowerCase() : '';
    
    producerCards.forEach(function(card) {
      const name = card.querySelector('.producer-name').textContent.toLowerCase();
      const capabilities = card.querySelector('.producer-capabilities').textContent.toLowerCase();
      const location = card.querySelector('.producer-location span').textContent.toLowerCase();
      
      const matchesCapability = capabilityValue === 'all' || capabilities.includes(capabilityValue.toLowerCase());
      const matchesLocation = locationValue === 'all' || 
                             (locationValue === 'local' && location.includes('Chicago')) ||
                             (locationValue === 'region' && (location.includes('Chicago') || location.includes('IL'))) ||
                             (locationValue === 'country');
      const matchesSearch = !searchValue || name.includes(searchValue) || capabilities.includes(searchValue) || location.includes(searchValue);
      
      if (matchesCapability && matchesLocation && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
  
  // Capacity form calculations
  const weeklyCapacityInput = document.getElementById('weekly_capacity');
  const dayInputs = document.querySelectorAll('[id$="_start"], [id$="_end"]');
  
  if (weeklyCapacityInput && dayInputs.length > 0) {
    // Calculate total hours based on schedule
    dayInputs.forEach(function(input) {
      input.addEventListener('change', calculateTotalHours);
    });
    
    function calculateTotalHours() {
      let totalHours = 0;
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      days.forEach(function(day) {
        const startInput = document.getElementById(`${day}_start`);
        const endInput = document.getElementById(`${day}_end`);
        
        if (startInput && endInput && startInput.value && endInput.value) {
          const startTime = new Date(`2025-01-01T${startInput.value}:00`);
          const endTime = new Date(`2025-01-01T${endInput.value}:00`);
          
          if (endTime > startTime) {
            const diffHours = (endTime - startTime) / (1000 * 60 * 60);
            totalHours += diffHours;
          }
        }
      });
      
      weeklyCapacityInput.value = Math.round(totalHours);
    }
  }
  
  // Message conversation selector
  const conversationItems = document.querySelectorAll('.conversation-item');
  
  conversationItems.forEach(function(item) {
    item.addEventListener('click', function() {
      conversationItems.forEach(function(conv) {
        conv.classList.remove('active');
      });
      
      item.classList.add('active');
      
      // In a real app, would load the conversation content here
    });
  });
});

// Function to initialize demo data in localStorage
function initializeDemoData() {
  console.log("Initializing demo data");
  
  try {
    // Clear localStorage for testing/debugging
    // Uncomment this line to reset localStorage during development
    // localStorage.clear();
    
    // Check if we already have users in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('presslyUsers')) || [];
    
    if (existingUsers.length === 0) {
      console.log("No users found in localStorage, creating demo users");
      
      // Create demo users array
      const demoUsers = [
        {
          id: 'user_1',
          email: 'designer@example.com',
          password: 'password123',
          fullName: 'John Designer',
          phone: '555-123-4567',
          userType: 'designer',
          createdAt: new Date().toISOString()
        },
        {
          id: 'user_2',
          email: 'producer@example.com',
          password: 'password123',
          fullName: 'Jane Producer',
          businessName: 'Quality Print Shop',
          phone: '555-765-4321',
          userType: 'producer',
          createdAt: new Date().toISOString()
        }
      ];
      
      // Save to localStorage
      localStorage.setItem('presslyUsers', JSON.stringify(demoUsers));
      console.log('Demo users saved to localStorage:', demoUsers);
    } else {
      console.log('Users already exist in localStorage:', existingUsers);
    }
    
    // Initialize demo designs if none exist
    if (!localStorage.getItem('presslyDesigns')) {
      const demoDesigns = [
        {
          id: 'design_1',
          designerId: 'user_1',
          title: 'Summer T-Shirt Design',
          description: 'Vibrant summer-themed t-shirt with beach motifs.',
          specifications: {
            size: '8.5x11 inches',
            colors: 'CMYK',
            materials: 'Cotton'
          },
          status: 'active',
          created_at: new Date('2025-03-15').toISOString(),
          file_path: 'tshirt-design.jpg'
        },
        {
          id: 'design_2',
          designerId: 'user_1',
          title: 'Event Poster',
          description: 'Promotional poster for upcoming music festival.',
          specifications: {
            size: '18x24 inches',
            colors: 'RGB',
            materials: '100lb Gloss'
          },
          status: 'draft',
          created_at: new Date('2025-03-28').toISOString(),
          file_path: 'poster.jpg'
        }
      ];
      
      localStorage.setItem('presslyDesigns', JSON.stringify(demoDesigns));
      console.log('Demo designs initialized in localStorage');
    }
  } catch (error) {
    console.error("Error initializing demo data:", error);
  }
}
