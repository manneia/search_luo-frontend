<template>
  <div class="home">
    <a-input-search
      v-model:value="searchText"
      placeholder="请输入搜索关键词"
      enter-button="Search"
      size="large"
      @search="onSearch"
    />
    <MyDivider />
    <a-tabs v-model:activeKey="activeKey" @change="onTabChange">
      <a-tab-pane key="post" tab="文章">
        <PostList :post-list="postList" />
      </a-tab-pane>
      <a-tab-pane key="picture" tab="图片">
        <PictureList :picture-list="pictureList" />
      </a-tab-pane>
      <a-tab-pane key="user" tab="用户">
        <UserList :user-list="userList" />
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const router = useRouter();
const route = useRoute();
const postList = ref([]);
const userList = ref([]);
const pictureList = ref([]);
const activeKey = route.params.category;
const searchText = ref(route.query.text || "");
const initSearchParams = {
  type: activeKey,
  text: "",
  pageSize: 10,
  pageNum: 1,
};

/**
 * 加载数据
 * @param params 搜索参数
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loadDataOld = (params: any) => {
  const postQuery = {
    ...params,
    searchText: params.text,
  };
  MyAxios.post("post/list/page/vo", postQuery).then((res: any) => {
    postList.value = res?.records;
  });
  const userQuery = {
    ...params,
    userName: params.text,
  };
  MyAxios.post("user/list/page/vo", userQuery).then((res: any) => {
    userList.value = res?.records;
  });
  const pictureQuery = {
    ...params,
    searchText: params.text,
  };
  MyAxios.post("picture/list/page/vo", pictureQuery).then((res: any) => {
    pictureList.value = res?.records;
  });
};

/**
 * 加载数据
 * @param params 搜索参数
 */
const loadData = (params: any) => {
  const { type } = params;
  // if (!type) {
  //   message.error("类别为空");
  //   return;
  // }
  const query = {
    ...params,
    searchText: params.text,
  };
  MyAxios.post("search/all", query).then((res: any) => {
    if (type === "post") {
      postList.value = res?.dataList;
    } else if (type === "user") {
      userList.value = res?.dataList;
    } else if (type === "picture") {
      pictureList.value = res?.dataList;
    }
  });
};

/**
 * 加载单类数据
 * @param params 搜索参数
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loadAllData = (params: any) => {
  const query = {
    ...params,
    searchText: params.text,
  };
  MyAxios.post("search/all", query).then((res: any) => {
    postList.value = res?.postList;
    userList.value = res?.userList;
    pictureList.value = res?.pictureList;
  });
};
const searchParams = ref(initSearchParams);

//首次请求
loadData(initSearchParams);

watchEffect(() => {
  searchParams.value = {
    ...initSearchParams,
    text: route.query.text as string,
    type: route.params.category,
  } as any;
  loadData(searchParams.value);
});
const onSearch = (value: string) => {
  router.push({
    query: {
      ...searchParams.value,
      text: value,
    },
  });
};
const onTabChange = (key: string) => {
  router.push({
    path: `${key}`,
    query: searchParams.value,
  });
};
</script>
