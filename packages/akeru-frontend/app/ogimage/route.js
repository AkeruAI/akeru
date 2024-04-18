import { ImageResponse } from "@vercel/og";

export async function GET(request) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <svg
          width="75"
          viewBox="0 0 75 65"
          fill="#000"
          style={{ margin: "0 75px" }}
        >
          <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
        </svg>
        <div style={{ marginTop: 40 }}>AkeruAI - Home</div>
        <div style={{ fontSize: "18px" }}>Open Source AI</div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  );
}
