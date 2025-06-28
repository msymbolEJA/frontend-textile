import React from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const ApexChart = ({ data, title }) => {
  console.log("ApexChart", data);
  const groupedData = {};
  let totalCount = 0;
  data.forEach(item => {
    const { type, count } = item;
    groupedData[type] = (groupedData[type] || 0) + count;
    totalCount += count;
  });

  const sortedData = Object.entries(groupedData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([type, count]) => ({
      name: `${type} (${count})`,
      y: ((count / totalCount) * 100).toFixed(2),
    }));

  const options = {
    animationEnabled: true,
    data: [
      {
        type: "pie",
        showInLegend: true,
        indexLabel: " {name} - {y} ",
        yValueFormatString: "'%' # ",
        dataPoints: sortedData,
      },
    ],
  };

  return (
    <div style={{ marginTop: 40, marginBottom: 20 }}>
      <h3>{title}({totalCount})</h3>
      <CanvasJSChart options={options}  />
      <style>{`.canvasjs-chart-credit { display: none; }`}</style>
    </div>
  );
};

export default ApexChart;
