import {getHistory} from "../utils/api";
import {HistoryItem} from "../utils/types";
import {useEffect, useState} from "react";
import HistoryCard from "./HistoryCard";

export default function HistoryItems() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => {
    getHistory().then(data => {
      setHistory(data);
    })
  }, []);
  return (
    <>
      {history.map((item, index) => <HistoryCard key={item.id} index={index} item={item}/>)}
    </>
  )
}
