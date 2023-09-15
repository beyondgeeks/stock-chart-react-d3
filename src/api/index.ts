import axios from "axios";

const api = axios.create({baseURL: process.env.REACT_APP_API_URL});

export const getStocks = async ({from="", to=""}:
  {
    from?: string;
    to?: string
  }
) => {
  try {
    const { data } = await api.get(`/eod/AAPL.US?api_token=${process.env.REACT_APP_API_TOKEN}&period=d&fmt=json&from=${from}&to=${to}`);
    return data;
  } catch(e) {
    console.error(e);
  }
}
