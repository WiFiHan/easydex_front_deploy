import { useEffect } from "react";
import useDexList from "../../data/dex";
import { BigBlock, SmallBlock } from "./index";
import { Link } from "react-router-dom";
import {
  getCookie,
  setSessionStorage,
  getSessionStorage,
} from "../../utils/cookie";

export const Tag = ({ id }, { dexid }) => {
  const dexList = getSessionStorage("cachedDexList");

  const tagid = id;
  const dex = dexList.filter((item) => item.id === id)[0];
  const showTitle = dex.reduced_title.slice(0, 8) + "...";

  return (
    dex && (
      <div className="btn btn-xs btn-outline m-2 uppercase">
        <Link to={"/Bigblock/" + tagid} state={{ istag: true }}>
          {showTitle}
        </Link>
      </div>
    )
  );
};
