import React, {useEffect, useRef} from "react";
import * as echarts from "echarts";

export default function Chart(props) {
  const chartRef = useRef(null);
  // 父组件传递的参数
  const options  = props.parameter;
  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    // const options = {options};
    chartInstance.setOption(options ?? {});

    return () => {
      // 组件卸载时调用 dispose 释放图表实例，解决图表错乱重叠问题
      chartInstance.dispose();
    };
  }, [options]);


  return (
    <div>
      <div ref={chartRef} style={{width:1000, height: 200}}/>
    </div>
  );
}
