import * as React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <Card style={{ width: "400px" }}>
        <CardHeader
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <CardTitle>Financial things</CardTitle>
        </CardHeader>
        <CardContent>
          <Input type="search" placeholder="Search" />
        </CardContent>
      </Card>
    </div>
  );
}
