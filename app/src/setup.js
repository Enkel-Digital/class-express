/**
 * Setup code wrapped in their individual IIFEs
 * To be ran before main.js by being imported from main.js
 */

(function checkMobile() {
  // Instead of relying on this, ping our own server's /ping route with a timestamp query to see if we get an ans
  const isOnline = navigator.onLine;

  // @todo Attach event listeners to for when the connection changes

  console.log("Network connection: ", isOnline);
  if (!isOnline) {
    alert("App is not connected to the internet");
  }
})();

(function checkMobile() {
  // Detect if the user is using a mobile device
  const isMobile = navigator.userAgent.match(
    /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
  );
  console.log("isMobile: ", isMobile);
  if (!isMobile)
    alert("Please use this app only on mobile for a better experience!");
})();

(function iosOrAndroid() {
  // Detect if the user is using a mobile device
  const isIOS = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i);
  const isAndroid = navigator.userAgent.match(/(android)|(webOS)/i);
  console.log("IOS: ", isIOS);
  console.log("Android: ", isAndroid);
})();
