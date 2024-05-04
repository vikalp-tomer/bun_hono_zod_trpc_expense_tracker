import { useEffect, useState } from "react";
import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function App() {
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    async function fetchTotal() {
      const res = await fetch("/api/expenses/total-spent");
      const { totalSpent } = await res.json();
      setTotalSpent(totalSpent);
    }
    fetchTotal();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The Total amount you've spent</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{totalSpent}</p>
      </CardContent>
    </Card>
  );
}

export default App;
