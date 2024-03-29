import axios from "axios";

const MyAxios = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000,
});

// 添加响应拦截器
MyAxios.interceptors.response.use(
  (res) => {
    const data = res.data;
    if (data.code === 0) {
      return data.data;
    }
    console.error("request error", data);
    return res.data;
  },
  (err) => {
    return err;
  }
);

export default MyAxios;
