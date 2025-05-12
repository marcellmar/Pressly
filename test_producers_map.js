/**
 * Test script to validate that all producers are showing on the map
 * This will be injected into the browser console when the Producers page loads
 */

console.log('======= PRODUCER MAP TEST SCRIPT RUNNING =======');

// Function to run after page loads
function testProducersMap() {
  // Wait for map to be fully initialized and data loaded
  setTimeout(() => {
    // Calculate number of producers expected
    const defaultProducers = document.querySelectorAll('.producer-marker').length;
    const allProducers = window.allProducers ? window.allProducers.length : 0;

    // Get information on map markers
    let mapMarkers = 0;
    if (window.markersRefCurrent) {
      mapMarkers = window.markersRefCurrent.length;
    }

    console.log('======= PRODUCER MAP TEST RESULTS =======');
    console.log(`Default producers in DOM: ${defaultProducers}`);
    console.log(`Producers in allProducers array: ${allProducers}`);
    console.log(`Map markers visible: ${mapMarkers}`);
    
    // Check if producer counts match up
    if (mapMarkers > 0 && (mapMarkers >= 30)) {
      console.log('✅ TEST PASSED: At least 30 producers are showing on the map');
    } else {
      console.log('❌ TEST FAILED: Fewer than 30 producers are showing on the map');
    }
    
    // Save marker counts to window for inspection
    window.testResults = {
      defaultProducers,
      allProducers,
      mapMarkers
    };
    
    console.log('=========================================');
  }, 2000); // Give the map 2 seconds to fully render
}

// Save reference to all markers for testing
const originalUpdateMapMarkers = window.updateMapMarkers;
if (originalUpdateMapMarkers) {
  window.updateMapMarkers = function() {
    const result = originalUpdateMapMarkers.apply(this, arguments);
    // Store marker references for testing
    window.markersRefCurrent = window.markersRef.current;
    return result;
  };
}

// Store allProducers array for testing
const originalFilteredProducers = window.filteredProducers;
if (originalFilteredProducers) {
  window.allProducers = originalFilteredProducers;
}

// Run test
testProducersMap();

// Additional helper to force refresh markers
window.forceRefreshMarkers = function() {
  if (window.mapInstanceRef && window.mapInstanceRef.current) {
    window.mapInstanceRef.current.invalidateSize();
    console.log('Map manually refreshed');
  }
  
  if (window.updateMapMarkers) {
    window.updateMapMarkers();
    console.log('Markers manually updated');
  }
};