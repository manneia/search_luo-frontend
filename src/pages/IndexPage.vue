<template>
  <div class="home">
    <a-input-search
      v-model:value="searchParams.text"
      placeholder="input search text"
      enter-button="Search"
      size="large"
      @search="onSearch"
    />
    <MyDivider />
    <a-tabs v-model:activeKey="activeKey" @change="onTabChange">
      <a-tab-pane key="post" tab="Tab 1">
        <PostList />
      </a-tab-pane>
      <a-tab-pane key="picture" tab="Tab 2">
        <PictureList />
      </a-tab-pane>
      <a-tab-pane key="user" tab="Tab 3">
        <UserList />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import PostList from "@/components/PostList.vue";
import PictureList from "@/components/PictureList.vue";
import UserList from "@/components/UserList.vue";
import MyDivider from "@/components/MyDivider.vue";
import { useRoute, useRouter } from "vue-router";
import MyAxios from "@/plugins/MyAxios";

MyAxios.get("/post/get/vo?id=" + "1632559628878602242").then((res) => {
  console.log(res);
});
const router = useRouter();
const route = useRoute();

const activeKey = route.query.category;
const initSearchParams = {
  text: "",
  pageSize: 10,
  pageNum: 1,
};
const searchParams = ref(initSearchParams);
watchEffect(() => {
  searchParams.value = {
    ...initSearchParams,
    text: route.query.text as string,
  } as never;
});
const onSearch = (value: string) => {
  alert(value);
  router.push({
    query: searchParams.value,
  });
};
const onTabChange = (key: string) => {
  router.push({
    path: `${key}`,
    query: searchParams.value,
  });
};
</script>
