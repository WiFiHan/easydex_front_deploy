import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "chart.js";
import { Line } from "react-chartjs-2";
import { watchDex, getDexes, getDexesAPI, pullDexes } from "../../apis/api";
import dexList from "../../data/dex";
//기본 Line 차트
//https://react-chartjs-2.js.org/examples/line-chart

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// //comment out
// const invesstDummy = {"07/21/2023": "4,536.34", "07/20/2023": "4,534.87", "07/19/2023": "4,565.72", "07/18/2023": "4,554.98", "07/17/2023": "4,522.79", "07/14/2023": "4,505.42", "07/13/2023": "4,510.04", "07/12/2023": "4,472.16", "07/11/2023": "4,439.26", "07/10/2023": "4,409.53", "07/07/2023": "4,398.95", "07/06/2023": "4,411.59", "07/05/2023": "4,446.82", "07/03/2023": "4,455.59", "06/30/2023": "4,450.38", "06/29/2023": "4,396.44", "06/28/2023": "4,376.86", "06/27/2023": "4,378.41", "06/26/2023": "4,328.82"};
// const ecoDummy1 = {"202207": "2.93", "202208": "2.98", "202209": "3.38", "202210": "4.01", "202211": "4.29", "202212": "4.22", "202301": "3.83", "202302": "3.54", "202303": "3.56", "202304": "3.43"};
// const ecoDummy2 = {"2021Q1": "1766721.3", "2021Q2": "1810575.9", "2021Q3": "1845539.5", "2021Q4": "1862908.4", "2022Q1": "1862949.5", "2022Q2": "1868426.7", "2022Q3": "1871108", "2022Q4": "1867553.3", "2023Q1": "1853899.8"}
// const ecoDummy3 = {"2015": "85.28", "2016": "80.2", "2017": "76.99", "2018": "73.55", "2019": "73.49", "2020": "76.27", "2021": "78.55"}

// const investXDataCheck = Object.keys(invesstDummy);
// const investYDataCheck = Object.values(invesstDummy);
// for(var i = 0; i<investYDataCheck.length;i++){
//   investYDataCheck[i] = investYDataCheck[i].replace(',','')*1;
// }

// const dummy ={"14" : 1400.00, "15" : 1500.00,"16" : 1600.00, "17" : 1700.00};
// const xDatas = Object.keys(dummy);
// const yDatas = Object.values(dummy);
// const xDummy = Object.keys(investXDataCheck);
// const yDummy = Object.values(investYDataCheck);
// const yDummnyNum = yDummy.map(parseFloat);
// const dummyMinNum = (Math.min(...yDummnyNum)*0.99);
// const dummyMaxNum = (Math.max(...yDummnyNum)*1.01);

// export const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: 'top',
//       display: false,
//     },
//     title: {
//       display: false,
//       text: 'Chart.js Line Chart',
//     },
//   },
//   scales: {
//     y:{
//       min: dummyMinNum,
//       max: dummyMaxNum,
//     }
//   },
// };

// //차트 px 단위 기본 폰트 크기 설정
// Chart.defaults.font.size = 10;

// export const data = {
//   labels: xDummy,
//   datasets: [
//     {
//       label: 'dex_name', //그래프 분류되는 항목
//       data: yDummnyNum, //실제 그려지는 데이터(Y축 숫자)
//       borderColor: 'rgb(255, 99, 132)', //그래프 선 color
//       backgroundColor: 'rgba(255, 99, 132, 0.5)', //마우스 호버시 나타나는 분류네모 표시 bg
//     },
//   ],
// };

//   const keys = Object.keys(ecoDummy2)
//   const values = Object.values(ecoDummy2);
//   if(keys[0].length <= 4){
//     console.log("경제지표이고 연도 데이터");
//   }
//   else{
//     if(keys[0].includes("Q")){
//       console.log("경제지표이고 분기 데이터");
//     }
//     else
//       console.log("경제지표이고 월별 데이터");
//   };
// //comment out

export function LineChart({ dex, state }) {
  const xDatas = Object.keys(dex.values).reverse();
  const values = Object.values(dex.values);

  if (dex.isInvest) {
    for (var i = 0; i < values.length; i++) {
      values[i] = values[i].replace(",", "") * 1;
    }
    Chart.defaults.font.size = 10;
  } else {
    if (xDatas[0].length) {
      Chart.defaults.font.size = 10;
    } else if (xDatas[0].includes("Q")) {
      Chart.defaults.font.size = 8;
    } else Chart.defaults.font.size = 8;
  }

  const yDatas = values.map(parseFloat).reverse();
  const valueMinNum = Math.min(...yDatas) * 0.99;
  const valueMaxNum = Math.max(...yDatas) * 1.01;

  const data = {
    labels: xDatas,
    datasets: [
      {
        label: "dex.title", //그래프 분류되는 항목
        data: yDatas, //실제 그려지는 데이터(Y축 숫자)
        borderColor: "rgb(255, 99, 132)", //그래프 선 color
        backgroundColor: "rgba(255, 99, 132, 0.5)", //마우스 호버시 나타나는 분류네모 표시 bg
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRation: false,
    // aspectRatio : chartRatio,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
    },
    scales: {
      y: {
        min: valueMinNum,
        max: valueMaxNum,
      },
    },
  };

  if (state) {
    options.aspectRatio = 4 / 3;
    return (
      <div className="contentWrap">
        <div className="contentInner w-[400px]">
          <Line options={options} data={data} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="contentWrap">
        <div className="contentInner w-[265px]">
          <Line options={options} data={data} />
        </div>
      </div>
    );
  }
}
