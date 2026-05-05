import { ImageResponse } from "next/og";
import { getMessageById } from "@/lib/data";

export const runtime = "edge";
export const alt = "Pesan SendHeartHaven";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const message = await getMessageById(resolvedParams.id);

  if (!message) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#FAF7F2", fontSize: 48, fontFamily: "serif" }}>
          Pesan tidak ditemukan.
        </div>
      )
    );
  }

  // Truncate content
  let text = message.content;
  if (text.length > 150) {
    text = text.slice(0, 150) + "...";
  }

  // Construct absolute URL since Satori requires absolute URLs
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const bgUrl = new URL('/bg-og.png', baseUrl).toString();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#FAF7F2",
          position: "relative",
        }}
      >
        {/* Background Image Wrapper */}
        <div style={{ display: "flex", position: "absolute", inset: 0 }}>
          <img
            src={bgUrl}
            alt="background"
            width={1200}
            height={630}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.15 }}
          />
        </div>

        {/* Content Wrapper */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "80px",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: "80px",
              color: "#d4b895",
              marginBottom: "20px",
              fontFamily: "serif",
              lineHeight: 1,
            }}
          >
            "
          </div>
          <div
            style={{
              fontSize: "48px",
              fontFamily: "serif",
              color: "#292524",
              textAlign: "center",
              fontStyle: "italic",
              lineHeight: 1.4,
              maxWidth: "900px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
            {text}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "40px",
              fontSize: "24px",
              color: "#57534e",
            }}
          >
            <div style={{ width: "40px", height: "2px", backgroundColor: "#d4b895", marginRight: "16px" }} />
            Dari {message.author}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              fontSize: "16px",
              color: "#78716c",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            SendHeartHaven
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
