<template>
  <div class="single-post-page">
    <section class="post">
      <h1 class="post-title">{{loadedPost.title}}</h1>
      <div class="post-details">
        <div class="post-detail">Last updates on {{loadedPost.updatedDate | date}}</div>
        <div class="post-detail">Written by {{loadedPost.author}}</div>
      </div>
      <p class="post-content">{{loadedPost.content}}</p>
    </section>
    <section class="post-feedback">
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing
        <a href="mailto:feedback@teste.com">feedback@teste.com</a>.
      </p>
    </section>
  </div>
</template>

<script>
export default {
  async asyncData(context) {
    if(context.payload) {
      return {
        loadedPost: context.payload.postData
      }
    }
    try {
       const { data } = await context.$axios.get(`/posts/${context.params.id}.json`);
       return {
         loadedPost: data
       }
    } catch (error) {
      context.error(error);
    }
  },
  head() {
   return {
      title: this.loadedPost.title
   }
  }
};
</script>

<style scoped>
.single-post-page {
  padding: 30px;
  text-align: center;
  box-sizing: border-box;
}

.post {
  width: 100%;
}

@media (min-width: 768px) {
  .post {
    width: 600px;
    margin: auto;
  }
}

.post-title {
  margin: 0;
}

.post-details {
  padding: 10px;
  box-sizing: border-box;
  border-bottom: 3px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

@media (min-width: 768px) {
  .post-details {
    flex-direction: row;
  }
}

.post-detail {
  color: rgb(88, 88, 88);
  margin: 0 10px;
}

.post-feedback a {
  color: red;
  text-decoration: none;
}

.post-feedback a:hover,
.post-feedback a:active {
  color: salmon;
}
</style>
