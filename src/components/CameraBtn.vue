<template>
  <span>
    <input
      type="file"
      id="img"
      accept="image/x-png,image/jpeg"
      capture="camera"
      style="display: none"
    />
    <!-- <label for="img">Click me to upload image</label> -->
    <label for="img">
      <v-icon>mdi-camera</v-icon>
    </label>
  </span>
</template>

<script>
// Can be used for anything, from QR code scanner for attendance taking to...
export default {
  name: "CameraBtn",
};
</script>
