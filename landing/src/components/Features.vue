<template>
  <section class="section">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <div class="container">
      <h1 class="title">Features to help you succeed</h1>
      <h2 class="subtitle">
        Maximise your Class Express experience through our user friendly
        interface and features, all in one place.
      </h2>
    </div>

    <div class="columns">
      <div class="column">Progress Tracking</div>
      <div class="column">Multiple Workouts</div>
      <div class="column">Enrichment Classes</div>
      <div class="column">Fair Pricing</div>
      <div class="column">Flexible Schedule</div>
    </div>

    <img src="../assets/app_screen_mockup.png" alt="App screen UI mockups" />

    <div
      class="icon"
      style="
        width: 50px;
        height: 50px;
        color: rgb(67, 217, 231);
        fill: rgb(67, 217, 231);
      "
    >
      <svg
        viewBox="0 0 100 92.31005859375"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <g transform="scale(1)">
          <path
            fill="#010101"
            d="M54.842,0.02c-0.1-0.01-0.2-0.02-0.3-0.02c-2.66,0-4.5,2.155-4.5,4.814c0,2.62,1.02,4.75,5.02,4.805v0.015c18.999,0.26,35.618,16.489,35.618,36.408c0,20.079-16.489,36.648-36.568,36.648c-19.164,0-35.073-14.46-36.474-33.458h8.455L13.044,27.539L0,49.233h8C9.414,73.231,29.483,92.31,53.952,92.31C79.341,92.31,100,71.551,100,46.158C100,21.069,79.82,0.495,54.842,0.02z"
            transform="translate(0,0)"
          ></path>
          <path
            fill="#010101"
            d="M59.062,22.444c0-2.265-1.819-4.21-4.079-4.21h-0.881c-2.26,0-4.039,1.945-4.039,4.21v24.204L38.208,58.482c-1.75,1.75-1.66,4.59-0.005,6.33c1.66,1.76,4.569,1.76,6.319,0l13.1-13.1c0.1-0.11,0.18-0.22,0.28-0.32c0.72-0.745,1.159-1.755,1.159-2.87V22.444z"
            transform="translate(0,0)"
          ></path>
        </g>
      </svg>
    </div>
  </section>
</template>

<script>
// Template component to create main components from that are directly attached in App component.

export default {
  name: "Features",
};
</script>
