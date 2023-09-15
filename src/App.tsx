import { useState,  useEffect } from "react";

import './App.scss';
import Chart from "./components/Chart";
import { getStocks } from "./api";

function App() {
  const [data, setData] = useState([]);
  const [from, setFrom] = useState("2023-07-22");
  const [to, setTo] = useState("2023-08-25");

  useEffect(() => {
    (async() => {
      const data = await getStocks({from, to});
      setData(data);
    })();
  }, [from, to])

  const handleFromChange = (value: string) => {
    if (new Date(value) < new Date(to)) {
      setFrom(value);
    }
  }

  const handleToChange = (value: string) => {
    if (new Date(value) > new Date(from)) {
      setTo(value);
    }
  }

  return (
    <div className="container">
      <div className="flex justify-center mb-5">
        <div className="input-group">
          <span>Symbol: US($)</span>
        </div>
        <div className="input-group">
          <span>From:</span>
          <input type="date" value={from} onChange={(event) => handleFromChange(event.target.value)}/>
        </div>
        <div className="input-group">
          <span>To:</span>
          <input type="date" value={to} onChange={(event) => handleToChange(event.target.value)}/>
        </div>
      </div>
      <div className="flex">
        <Chart data={data}/>
      </div>
    </div>
  );
}

export default App;
