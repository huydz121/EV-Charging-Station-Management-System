// ================================================================
// EV Charging System - Map (Leaflet.js)
// ================================================================

let map;
let markers = [];

document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('map')) return;

  // Initialize map at Quy Nhơn
  map = L.map('map').setView([13.7788, 109.2215], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  // Custom marker icon
  const stationIcon = L.divIcon({
    html: '<div style="background: #00e676; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,230,118,0.4); font-size: 14px;">⚡</div>',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: 'ev-marker'
  });

  // Add station markers
  if (typeof stationsData !== 'undefined' && stationsData.length > 0) {
    stationsData.forEach(function (station) {
      if (station.location && station.location.coordinates) {
        const [lng, lat] = station.location.coordinates;
        const availableCount = station.connectors ? station.connectors.filter(c => c.status === 'available').length : 0;
        const totalCount = station.connectors ? station.connectors.length : 0;

        const marker = L.marker([lat, lng], { icon: stationIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: 'Inter', sans-serif; min-width: 200px;">
              <h4 style="margin: 0 0 6px; font-size: 14px; font-weight: 700;">${station.name}</h4>
              <p style="margin: 0 0 4px; font-size: 12px; color: #666;">${station.address}</p>
              <p style="margin: 0 0 4px; font-size: 12px;"><strong style="color: #00c853;">${availableCount}/${totalCount}</strong> trụ trống</p>
              <p style="margin: 0 0 8px; font-size: 12px;">💰 ${station.pricePerKwh ? station.pricePerKwh.toLocaleString('vi-VN') : '0'}đ/kWh</p>
              <a href="/customer/stations/${station._id}" style="display: inline-block; padding: 6px 12px; background: #00e676; color: #000; border-radius: 6px; font-size: 12px; font-weight: 600; text-decoration: none;">Chi tiết →</a>
            </div>
          `);
        markers.push({ marker, station });
      }
    });

    // Fit bounds to show all markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers.map(m => m.marker));
      map.fitBounds(group.getBounds().pad(0.1));
    }

    updateStationList(stationsData);
  }

  // Try to get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (pos) {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;

      const userIcon = L.divIcon({
        html: '<div style="background: #448aff; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 10px rgba(68,138,255,0.5);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        className: 'user-marker'
      });

      L.marker([userLat, userLng], { icon: userIcon }).addTo(map)
        .bindPopup('📍 Vị trí của bạn');

      map.setView([userLat, userLng], 14);
    });
  }
});

function updateStationList(stations) {
  const container = document.getElementById('stationResults');
  const countEl = document.getElementById('stationCount');
  if (!container) return;

  countEl.textContent = stations.length + ' trạm';
  container.innerHTML = '';

  stations.forEach(function (station) {
    const availableCount = station.connectors ? station.connectors.filter(c => c.status === 'available').length : 0;
    const totalCount = station.connectors ? station.connectors.length : 0;

    container.innerHTML += `
      <a href="/customer/stations/${station._id}" class="station-item">
        <div class="station-item-icon"><i class="fas fa-charging-station"></i></div>
        <div class="station-item-info">
          <div class="station-item-name">${station.name}</div>
          <div class="station-item-address">${station.address}</div>
          <div class="station-item-meta">
            <span class="station-meta-chip meta-chip-available">
              <i class="fas fa-circle" style="font-size: 6px;"></i> ${availableCount}/${totalCount} trống
            </span>
            <span class="station-meta-chip meta-chip-price">
              <i class="fas fa-tag"></i> ${station.pricePerKwh ? station.pricePerKwh.toLocaleString('vi-VN') : '0'}đ/kWh
            </span>
          </div>
        </div>
      </a>
    `;
  });
}

function searchStations() {
  const query = document.getElementById('searchStationInput').value.toLowerCase();
  if (!stationsData) return;

  const filtered = stationsData.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.address.toLowerCase().includes(query)
  );

  updateStationList(filtered);

  // Update map markers visibility
  markers.forEach(m => {
    const match = filtered.find(s => s._id === m.station._id);
    if (match) {
      m.marker.setOpacity(1);
    } else {
      m.marker.setOpacity(0.2);
    }
  });
}
