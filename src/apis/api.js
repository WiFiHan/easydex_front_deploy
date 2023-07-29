import {
  getSessionStorage,
  setSessionStorage,
  removeCookie,
} from "../utils/cookie";
import { instance, instanceWithToken } from "./axios";

// Account API
export const signIn = async (data) => {
  try {
    const response = await instance.post("/account/signin/", data);
    if (response.status === 200) {
      window.location.href = "/";
    } else {
      console.log("Unknown Error");
    }
  } catch (error) {
    alert("check ID or Password");
  }
};

export const signUp = async (data) => {
  try {
    const response = await instance.post("/account/signup/", data);
    if (response.status === 200) {
      window.location.href = "/";
    }
    return response;
  } catch (error) {
    alert("password must be longer than 8 characters");
  }
};

// GetUser API
// Edit, Delete 권
export const getUser = async () => {
  const response = await instanceWithToken.get("/account/info/");
  if (response.status === 200) {
  } else {
    console.log("[ERROR] error while updating comment");
  }
  return response.data;
};

export const getUserProfile = async () => {
  const response = await instanceWithToken.get("/account/profile/");
  if (response.status === 200) {
    console.log("GET USER SUCCESS");
  } else {
    console.log("[ERROR] error while getting profile");
  }
  return response.data;
};

export const editUserProfile = async (formData) => {
  const response = await instanceWithToken.patch("/account/profile/", formData);
  if (response.status === 200) {
    console.log("EDIT USER SUCCESS");
    window.location.reload();
  } else {
    console.log("[ERROR] error while editting profile");
  }
  return response.data;
};

export const refreshToken = async (token) => {
  const response = await instance.post("/account/refresh/", { refresh: token });
  if (response.status === 200) {
    console.log("REFRESH TOKEN SUCCESS");
  } else {
    console.log("[ERROR] error while refreshing token");
  }
};

export const logOut = async (token) => {
  const response = await instanceWithToken.post("/account/logout/", {
    refresh: token,
  });
  if (response.status === 204) {
    console.log("REFRESH TOKEN SUCCESS");

    removeCookie("refresh_token");
    removeCookie("access_token");

    window.location.reload();
  } else {
    console.log("[ERROR] error while refreshing token");
  }
};

function getRandom(length) {
  return Math.floor(Math.random() * length);
}

function setTags(dexes) {
  // const dexNum = dexes.length;
  // const idArray = dexes.map(item => item.id).map(Number);
  dexes.map((dex) => {
    const data =
      typeof dex.tags === "string"
        ? JSON.parse(dex.tags.replace(/'/g, '"'))
        : dex.tags;
    if (data && data.length !== 0) {
      const relatedKeys = Object.keys(data)
        .filter((key) => data[key] !== "random")
        .sort((a, b) => data[b] - data[a])
        .map(Number);
      const randomKeys = Object.keys(data)
        .filter((key) => data[key] === "random")
        .map(Number);
      const concatTags = [...relatedKeys, ...randomKeys];
      dex.tags = concatTags;
    } else {
      const randomTag = [];
      dex.tags = randomTag;
    }
  });
}

export const getDexes = async () => {
  const response = await instance.get("/dexmanager/");
  if (response.status === 200 || response.status === 201) {
    console.log("getDexes SUCCESS");

    //이 자리에서 Tag를 다룹니다.
    setTags(response.data);
    setSessionStorage("cachedDexList", response.data);
  } else {
    console.log("[ERROR] error while getDexes");
  }
  return response.data;
};

export const pullEcoDexes = async () => {
  const response = await instance.post("/dexmanager/economy/");
  if (response.status === 200 || response.status === 201) {
    // console.log("POST SUCCESS");
  } else {
    // console.log("[ERROR] error while creating post");
  }
};

export const getDex = async (id) => {
  const response = await instance.get(`/dexmanager/${id}/`);
  return response.data;
};

export const updateDexWithTag = async (id, jsonObject) => {
  console.log(`updateDexWithTag begins`);

  try {
    const response = await instance.put(`/dexmanager/${id}/`);
    if (response.status === 200) {
      console.log("TAG UPDATE SUCCESS");
    } else {
      console.log("[ERROR] error while updating tag");
    }
  } catch (error) {
    console.log(error);
  }
};

export const pullDexes = async () => {
  const response = await instance.post("/dexmanager/");
  if (response.status === 200 || response.status === 201) {
    console.log("pullDexes SUCCESS");
    const dexes = await getDexes();
    await Promise.all(dexes.map(async (data) => pullDexHistory(data.id)));
    await pullEcoDexes();
  } else {
    // console.log("[ERROR] error while creating post");
  }
};

export const pullDexHistory = async (id) => {
  console.log(`pullDexHistory begins`);
  const response = await instance.post(`/dexmanager/${id}/`);
  if (response.status === 200 || response.status === 201) {
    // updateDexWithTag(id, jsonObject);
    //change value type here
  } else {
    console.log("[ERROR] error while creating post");
  }
};

export const watchDex = async (dexId) => {
  const response = await instanceWithToken.post(
    `/dexmanager/${dexId}/userdex/`
  );
  console.log(response);

  if (response.status === 200 || response.status === 201) {
    const user = await getUser();
    const dexList = getSessionStorage("cachedDexList");
    const dexes = await getDexes();
    // //Front에서 가공할 수 있게 data를 전처리하는 로직
    // dexes.map(function(dex) {
    //   if (typeof dex.tags === 'string') {
    //     const jsonTags = JSON.parse(dex.tags.replace(/'/g, '"'));
    //     const dexTags = Object.keys(jsonTags)
    //                             .sort((a, b) => jsonTags[b] - jsonTags[a])
    //                             .map(Number);
    //     dex.tags = dexTags;
    //   }});
    // 최초로 받아온 dexList를 localStorage에 저장합니다.

    const watchList = dexes.filter(
      (dex) => dex.watching_users.includes(user.id) > 0
    );
    setSessionStorage("watchingDex", watchList);
  } else {
    console.log("[ERROR] error while deleting post");
  }
};

export const pullNewsArticles = async () => {
  console.log(`getNewsArticles begins`);
  const response = await instance.post(`/dexmanager/hankyung/`);
  if (response.status === 200 || response.status === 201) {
    console.log(response.data);
  } else {
    console.log("[ERROR] error while creating post");
  }
};

export const getNewsSummaries = async () => {
  console.log(`getNewsArticles begins`);
  const response = await instance.get(`/dexmanager/hankyung/`);
  if (response.status === 200 || response.status === 201) {
    console.log("getNewsArticles SUCCESS");
  } else {
    console.log("[ERROR] error while getting NewsSummaries");
  }
  return response.data;
};
