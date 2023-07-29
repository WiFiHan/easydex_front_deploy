import { useEffect, useState } from "react";
import {
  getDexes,
  pullDexes,
  pullDexHistory,
  updateDexWithTag,
} from "../apis/api";
import {
  getCookie,
  setSessionStorage,
  getSessionStorage,
} from "../utils/cookie";

const useDexList = () => {
  const [cachedDexList, setCachedDexList] = useState([]);

  useEffect(() => {
    const updateData = async (firstDexList) => {
      if (firstDexList) {
        await pullDexes();
        const secondDexList = await getDexes();
        await Promise.all(
          secondDexList.map(async function (data) {
            try {
              updateDexWithTag(data.id);
            } catch (error) {
              //randomTag 할당
              console.log("ERROR WHILE UPDATEDEXWITHTAG");
            }
          })
        );
      }
    };

    const fetchData = async () => {
      try {
        // 최초 접속 시에는 localStorage에서 dexList를 불러옵니다.
        const cachedDexes = getSessionStorage("cachedDexList");
        if (cachedDexes && cachedDexes.length != 0) {
          setCachedDexList(cachedDexes);
        } else {
          const firstDexList = await getDexes();

          if (firstDexList.some((item) => item.values === null)) {
            await updateData(firstDexList);
            const dexes = await getDexes();
            setCachedDexList(dexes);
          } else {
            setCachedDexList(firstDexList);
          }

          // 최초로 받아온 dexList를 localStorage에 저장합니다.
        }
      } catch (error) {
        console.error(
          "지표 데이터를 가져오는 도중 오류가 발생했습니다:",
          error
        );
      }
    };
    fetchData();
  }, []);

  return cachedDexList;
};

export default useDexList;
