<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
export default {
  layout: "admin",
   middleware: ['check-auth', 'auth'],
  async asyncData(context) {
    try {
      const { data } = await context.$axios.get(
        `/posts/${context.params.postId}.json`
      );
      return {
        loadedPost: {...data, id: context.params.postId},
      };
    } catch (error) {
      context.error(error);
    }
  },
  methods: {
    async onSubmitted(editedPost) {
      await this.$store.dispatch("editPost", editedPost);
      this.$router.push("/admin");
    },
  },
};
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
