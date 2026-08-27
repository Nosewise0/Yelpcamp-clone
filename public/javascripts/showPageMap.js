maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: campground.geometry.coordinates,
  zoom: 11,
});

new maptilersdk.Marker({ color: "#FF385C" })
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<h6 class="fw-bold mb-1">${campground.title}</h6><p class="small text-muted mb-0">${campground.location}</p>`,
    ),
  )
  .addTo(map);
