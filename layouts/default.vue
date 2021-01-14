<template>
  <div>
    <the-header @sidenav-toggle="displaySidenav = !displaySidenav" />
    <the-sidenav :show="displaySidenav" @close="displaySidenav = false" />
    <nuxt />
  </div>
</template>

<script>
export default {
  // middleware: 'log',
  data() {
    return {
      displaySidenav: false,
    };
  },
};
</script>

<style>
html {
  font-family: "Open Sans", sans-serif;
}

body {
  margin: 0;
}
</style>
