import { useRef, useEffect } from "react";
import {
  select,
  line,
  scaleTime,
  min,
  max,
  scaleLinear,
  axisBottom,
  axisLeft,
} from "d3";

type Stock = {
  date: string;
  adjusted_close: number;
  close: number;
  high: number;
  low: number;
  open: number;
}

type Datum = {
  date: Date;
  value: number;
}

type ChartProps = {
  data: Stock[]
}

function Chart({ data }: ChartProps) {
  
  const svgRef = useRef<SVGSVGElement | null>(null);

  const width = 1000;
  const height = 500;

  useEffect(() => {
    if (!svgRef.current) return;
    select(svgRef.current).selectAll("*").remove();
    
    const margin = { left: 40, right: 30, top: 20, bottom: 40 };
    const parsedData = data.map((d) => ({
      date: new Date(d.date),
      value: d.close,
    }));  

    const x = scaleTime()
      .domain([min(parsedData, (d) => d.date)!, max(parsedData, (d) => d.date)!])
      .range([margin.left, width - margin.right]);
  
    const y = scaleLinear()
      .domain([min(parsedData, (d) => d.value)! - 10, max(parsedData, (d) => d.value)!])
      .range([height - margin.bottom, margin.top]);
  
    const lineFunc = line<Datum>()
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    const svg = select(svgRef.current);

    // Add the x-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(axisBottom<Date>(x).ticks(width / 100).tickSizeOuter(0));

    // Add the y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(axisLeft(y).ticks(height / 40))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - margin.left - margin.right)
          .attr("stroke-opacity", 0.1)
      )
      .append("text")
      .attr("x", -margin.left)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("↑ Daily close ($)");

    // Append a path for the line
    svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", lineFunc(parsedData));
  }, [data, width, height]);

  return (
    <div className="mx-auto">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ maxWidth: "100%", height: "auto"}}
      ></svg>
    </div>
  );
}

export default Chart;
