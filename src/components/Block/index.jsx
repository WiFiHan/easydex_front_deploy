import { Link } from "react-router-dom";
import useDexList from "../../data/dex";
import { Tag } from "./tag";
import { useState, useEffect } from "react";
import {
  watchDex,
  getDexes,
  getDex,
  getDexesAPI,
  pullDexes,
  getUser,
} from "../../apis/api";
import { getSessionStorage, getCookie } from "../../utils/cookie";
import { Chart, LineChart } from "./chart";
import { Line } from "react-chartjs-2";

// user 정보 가져오기
const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (getCookie("access_token")) {
      const getUserAPI = async () => {
        const user = await getUser();
        setUser(user);
      };
      getUserAPI();
    }
  }, []);

  return user;
};

// 즐겨찾기 추가 함수
const addToWatchlist = async (dex, user) => {
  console.log("addToWatchlist");
  watchDex(dex.id);
  const updatedDex = await getDex(dex.id);
  const isWatched = updatedDex.watching_users.includes(user.id) > 0;
  console.log(isWatched);
};

export const SmallBlock = ({ dex }) => {
  const small = false;
  const user = useUser();
  const smallDexTags = dex.tags.slice(0, 2);

  return (
    <div className="card w-[300px] h-[300px]  p-1 m-10  items-center justify-center bg-gradient-to-br rounded">
      <div className="smallblock relative flex flex-col bg-white ">
        <div className="px-2 py-1 flex justify-between">
          <div
            className="tooltip"
            data-tip="흰색 block은 투자지표이고 갈색 block은 경제지표입니다"
          >
            🙌
          </div>
          {user && (
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => addToWatchlist(dex, user)}
            >
              ❤️
            </button>
          )}
        </div>
        <div className="w-full flex flex-row flex-wrap justify-between">
          <div className="w-1/2 flex flex-col">
            <div className="flex flex-col justify-between">
              <Link
                to={"/Bigblock/" + dex.id}
                state={{ istag: false }}
                className="btn btn-lg btn-ghost"
              >
                {dex.reduced_title}
              </Link>
            </div>
          </div>
          <div className="flex justify-center items-center px-2">
            <p className="text-lg font-bold">{dex.closing}</p>
          </div>
          {smallDexTags && smallDexTags.length ? (
            <>
              {smallDexTags.map((id) => (
                <Tag id={id} dexid={dex.id} />
              ))}
            </>
          ) : null}
        </div>
        <div>
          <LineChart dex={dex} state={small} />
        </div>
      </div>
    </div>
  );
};

export const BigBlock = ({ dex }, index) => {
  const big = true;
  const user = useUser();
  const dexList = getSessionStorage("cachedDexList");
  const [modalOpen, setModalOpen] = useState(false);

  var tagDexarr = [];

  dex.tags.map((id) => {
    tagDexarr.push(dexList.find((dex) => dex.id === id));
  });

  const fromhome = dex.id === index;

  return (
    <div className="mainLayout">
      <div
        className={
          dex.isInvest
            ? "self-center p-1 my-10 items-center justify-center bg-gradient-to-br rounded  from-dexname/80"
            : "self-center p-1 my-10 items-center justify-center bg-gradient-to-br rounded from-economy_tag/80"
        }
      >
        <div className="bigblock relative flex flex-col bg-white">
          <div className="py-1 flex justify-between">
            <div
              className="tooltip"
              data-tip="흰색 block은 투자지표이고 갈색 block은 경제지표입니다"
            >
              🙌
            </div>
            {user && (
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => addToWatchlist(dex, user)}
              >
                ❤️
              </button>
            )}
          </div>
          <div className="flex flex-col justify-between ">
            <Link
              to={"/Bigblock/" + dex.id}
              state={{ istag: false }}
              className="text-4xl px-2 py-2 font-sans uppercase font-semibold"
            >
              {dex.title}
            </Link>
            <div className="flex flex-row">
              {dex.tags.map((id) => (
                <Tag id={id} dexid={dex.id} />
              ))}
            </div>
          </div>
          <div className="flex flex-row justify-between py-3">
            <div className="h-[300px] w-[400px]">
              <LineChart dex={dex} state={big} />
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="flex flex-col w-[200px]">
              <p className="flex text-4xl py-10 font-sans justify-center font-bold">
                {dex.closing}
              </p>
              <div className="italic">{dex.description}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        {tagDexarr.map((dex) => (
          <SmallBlock dex={dex} />
        ))}
      </div>
    </div>
  );
};

// export const SmallBlock = ({ dex }) => {

//   const [user, setUser] = useState(null);
//   useEffect(() => {
//     // access_token이 있으면 유저 정보 가져옴
//     if (getCookie("access_token")) {
//       const getUserAPI = async () => {
//         const user = await getUser();
//         setUser(user);
//       };
//       getUserAPI();
//     }
//   }, []);

//   const onClickWatch = () => {
//     console.log(dex.id);
//     watchDex(dex.id);
//   };

//   //Tag: 그냥 dex.tags의 첫 두 원소
//   const smallDexTags = dex.tags.slice(0, 2);
//   console.log(smallDexTags);

//     return dex.invest ? (
//       <div className="card w-[300px] h-[300px]  p-1 m-10  items-center justify-center bg-gradient-to-br rounded">
//         <div className="smallblock relative flex flex-col bg-white ">
//           <div className="px-2 py-1 flex justify-between">
//             <div
//               className="tooltip"
//               data-tip="흰색 block은 투자지표이고 갈색 block은 경제지표입니다"
//             >
//               🙌
//             </div>
//             {user && (<button className="btn btn-xs btn-ghost" onClick={onClickWatch}>
//                 ❤️
//               </button>)}
//           </div>
//           <div className="w-full flex flex-row flex-wrap justify-between">
//             <div className="w-1/2 flex flex-col">
//               <div className="flex flex-col justify-between">
//                 <Link
//                   to={"/Bigblock/" + dex.id}
//                   state={{ istag: false }}
//                   className="btn btn-lg btn-ghost"
//                 >
//                   {dex.title}
//                 </Link>
//               </div>
//               <p>{dex.closing}</p>
//             </div>
//             <div className="flex-col justify-center">
//               {smallDexTags && smallDexTags.length ? (
//                 <>
//                   <Tag id={smallDexTags[0]} dexid={dex.id} />
//                   <br></br>
//                   <Tag id={smallDexTags[1]} dexid={dex.id} />
//                 </>
//               ) : (
//                 <></>
//               )}
//             </div>
//           </div>
//           <div>
//             <LineChart dex={dex}/>
//           </div>
//         </div>
//       </div>
//     ) : (
//       <div className="card w-[300px] h-[300px] p-1 m-10 items-center justify-center bg-gradient-to-br rounded from-economy_tag/10">
//         <div className="smallblock relative flex flex-col bg-white ">
//           <div className="px-2 py-1 flex justify-between">
//             <div
//               className="tooltip"
//               data-tip="흰색 block은 투자지표이고 갈색 block은 경제지표입니다"
//             >
//               🙌
//             </div>
//             {user && (<button className="btn btn-xs btn-ghost" onClick={onClickWatch}>
//                 ❤️
//               </button>)}
//           </div>
//           <div className="w-full flex flex-row flex-wrap justify-between">
//             <div className="flex flex-col">
//               <div className="flex flex-row justify-between">
//                 <Link
//                   to={"/Bigblock/" + dex.id}
//                   state={{ istag: false }}
//                   className="btn btn-ghost btn-lg"
//                 >
//                   {dex.title}
//                 </Link>
//               </div>
//               <p>{dex.closing}</p>
//             </div>
//             <div className="flex-col">
//               {smallDexTags && smallDexTags.length ? (
//                 <>
//                   <Tag id={smallDexTags[0]} dexid={dex.id} />
//                   <br></br>
//                   <Tag id={smallDexTags[1]} dexid={dex.id} />
//                 </>
//               ) : (
//                 <></>
//               )}
//             </div>
//           </div>
//           <div>
//             <LineChart dex={dex}/>
//           </div>
//         </div>
//       </div>
//     );
// };

// export const BigBlock = ({ dex }, index) => {

//   const [user, setUser] = useState(null);
//   useEffect(() => {
//     // access_token이 있으면 유저 정보 가져옴
//     if (getCookie("access_token")) {
//       const getUserAPI = async () => {
//         const user = await getUser();
//         setUser(user);
//       };
//       getUserAPI();
//     }
//   }, []);

//   const onClickWatch = () => {
//     console.log(dex.id);
//     watchDex(dex.id);
//   };

//   const dexList = getSessionStorage("cachedDexList");
//   const [modalOpen, setModalOpen] = useState(false);
//   const showModal = () => {
//     setModalOpen(true);
//   };

//   var tagDexarr = [];

//   // console.log(dex);
//   dex.tags.map((id) => {
//     // tagDexarr.push(dexList.find((dex) => dex.id === id));
//     // console.log(id);
//     tagDexarr.push(dexList.find((dex) => dex.id === id));
//   });

//   // 추후 tag인지 smallblcok에서 왔는지 구분할때 필요
//   const fromhome = dex.id == index ? true : false;

//   return (
//     <div className="mainLayout">
//       {dex.invest ? (
//         <div className="self-center p-1 my-10 items-center justify-center bg-gradient-to-br rounded">
//           <div className="bigblock relative flex flex-col bg-white">
//             <div className="py-1 flex justify-between">
//               <div
//                 className="tooltip"
//                 data-tip="흰색 block은 투자지표이고 갈색 block은 경제지표입니다"
//               >
//                 🙌
//               </div>
//               {user && (<button className="btn btn-xs btn-ghost" onClick={onClickWatch}>
//                 ❤️
//               </button>)}
//             </div>
//             <div className="flex flex-col justify-between ">
//               <Link
//                 to={"/Bigblock/" + dex.id}
//                 state={{ istag: false }}
//                 className="text-4sxl px-2 py-2 font-sans uppercase"
//               >
//                 {dex.title}
//               </Link>
//               <div className="flex flex-row">
//                 {dex.tags.map((id) => (
//                   <Tag id={id} dexid={dex.id} />
//                 ))}
//               </div>
//             </div>
//             <div className="flex flex-row justify-between py-3">
//               <div className="flex flex-row">
//                 <p>{dex.closing}</p>
//                 <div className="h-[300px]">
//                 <LineChart dex={dex}/>
//                 </div>
//               </div>
//               <div className="divider divider-horizontal"></div>
//               <div>{dex.description}</div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="self-center p-1 my-10 items-center justify-center bg-gradient-to-br rounded from-economy_tag/80">
//           <div className="bigblock relative flex flex-col bg-white">
//             <div className=" flex justify-between">
//               <div
//                 className="tooltip"
//                 data-tip="흰색 block은 투자지표이고 갈색 block은 경제지표입니다"
//               >
//                 🙌
//               </div>
//               {user && (<button className="btn btn-xs btn-ghost" onClick={onClickWatch}>
//                 ❤️
//               </button>)}
//             </div>
//             <div className="flex flex-col justify-between">
//               <Link
//                 to={"/Bigblock/" + dex.id}
//                 state={{ istag: false }}
//                 className="text-4xl px-2 py-2 font-sans uppercase"
//               >
//                 {dex.title}
//               </Link>
//               <div className="flex flex-row">
//                 {dex.tags.map((id) => (
//                   <Tag id={id} dexid={dex.id} />
//                 ))}
//               </div>
//             </div>
//             <div className="flex flex-row justify-between py-3">
//               <div className="flex flex-col">
//                 <p>{dex.closing}</p>
//                 <div className="h-[300px]">
//                 <LineChart dex={dex}/>
//                 </div>
//               </div>
//               <div className="divider divider-horizontal"></div>
//               <div>{dex.description}</div>
//             </div>
//           </div>
//         </div>
//       )}
//       <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
//         {tagDexarr.map((dex) => (
//           <SmallBlock dex={dex} />
//         ))}
//       </div>
//     </div>
//   );
// };
