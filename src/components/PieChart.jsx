import { grey } from "@mui/material/colors";
import { mockPieData as data } from "../data/mockData";
import { ResponsivePie } from '@nivo/pie';

const PieChart = () => {
  return (
    <ResponsivePie
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: grey[900],
            },
          },
          legend: {
            text: {
              fill: grey[900],
            },
          },
          ticks: {
            line: {
              stroke: grey[900],
              strokeWidth: 1,
            },
            text: {
              fill: grey[900],
            },
          },
        },
        legends: {
          text: {
            fill: grey[900],
          },
        },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={ grey[900]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={grey[900]}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "column",
          justify: false,
          translateX: 90,
          translateY: 85,
          itemsSpacing: 0,
          itemWidth: 40,
          itemHeight: 18,
          itemTextColor: grey[900], 
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 12,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: grey[700], 
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
