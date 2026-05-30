import { ImageResponse } from "next/og";
import { getMessageById } from "@/lib/data";

export const runtime = "edge";
export const alt = "Pesan SendHeartHaven";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Load local fonts bundled in the edge runtime
const cormorantRegularPromise = fetch(
  new URL("../../../public/fonts/CormorantGaramond-Regular.woff", import.meta.url)
).then((res) => {
  if (!res.ok) throw new Error("Failed to load CormorantGaramond-Regular.woff");
  return res.arrayBuffer();
});

const cormorantItalicPromise = fetch(
  new URL("../../../public/fonts/CormorantGaramond-Italic.woff", import.meta.url)
).then((res) => {
  if (!res.ok) throw new Error("Failed to load CormorantGaramond-Italic.woff");
  return res.arrayBuffer();
});

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const message = await getMessageById(resolvedParams.id);

  const [cormorantRegular, cormorantItalic] = await Promise.all([
    cormorantRegularPromise,
    cormorantItalicPromise,
  ]);

  if (!message) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FAF7F2",
            color: "#2C2924",
            fontSize: 40,
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: "italic",
          }}
        >
          Pesan tidak ditemukan.
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Cormorant Garamond",
            data: cormorantRegular,
            style: "normal",
            weight: 400,
          },
        ],
      }
    );
  }

  // Truncate content to keep it clean and minimal
  let text = message.content;
  if (text.length > 150) {
    text = text.slice(0, 150) + "...";
  }

  // Construct absolute URL since Satori requires absolute URLs for images
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
          overflow: "hidden",
        }}
      >
        {/* Organic base paper texture with very low opacity */}
        <div style={{ display: "flex", position: "absolute", inset: 0 }}>
          <img
            src={bgUrl}
            alt="background"
            width={1200}
            height={630}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.07 }}
          />
        </div>

        {/* Ambient Glow & Radial Lighting Bloom Overlay */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255, 253, 248, 0.95) 0%, rgba(254, 249, 239, 0.85) 60%, rgba(242, 237, 227, 0.92) 100%)",
          }}
        />

        {/* Soft Vignette Overlay */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 50%, rgba(113, 90, 72, 0.05) 100%)",
          }}
        />

        {/* Floating cinematic dust particles */}
        <div style={{ display: "flex", position: "absolute", left: "12%", top: "22%", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "rgba(113, 90, 72, 0.12)" }} />
        <div style={{ display: "flex", position: "absolute", right: "18%", top: "28%", width: "2px", height: "2px", borderRadius: "50%", backgroundColor: "rgba(113, 90, 72, 0.18)" }} />
        <div style={{ display: "flex", position: "absolute", left: "28%", bottom: "18%", width: "3px", height: "3px", borderRadius: "50%", backgroundColor: "rgba(113, 90, 72, 0.10)" }} />
        <div style={{ display: "flex", position: "absolute", right: "22%", bottom: "22%", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "rgba(113, 90, 72, 0.08)" }} />
        <div style={{ display: "flex", position: "absolute", left: "48%", top: "12%", width: "2px", height: "2px", borderRadius: "50%", backgroundColor: "rgba(113, 90, 72, 0.15)" }} />

        {/* Content Wrapper */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "90px 120px",
            position: "relative",
          }}
        >
          {/* Subtle Literary Ornament */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "36px",
            }}
          >
            <div style={{ display: "flex", width: "24px", height: "1px", backgroundColor: "rgba(113, 90, 72, 0.2)" }} />
            <div style={{ display: "flex", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "rgba(113, 90, 72, 0.3)", margin: "0 8px" }} />
            <div style={{ display: "flex", width: "24px", height: "1px", backgroundColor: "rgba(113, 90, 72, 0.2)" }} />
          </div>

          {/* Centered Editorial Quote */}
          <div
            style={{
              fontSize: "44px",
              fontFamily: '"Cormorant Garamond", serif',
              color: "#262421",
              textAlign: "center",
              fontStyle: "italic",
              lineHeight: 1.5,
              maxWidth: "880px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              letterSpacing: "0.2px",
            }}
          >
            {`“${text}”`}
          </div>

          {/* Author Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "44px",
            }}
          >
            <div style={{ display: "flex", width: "40px", height: "1px", backgroundColor: "rgba(113, 90, 72, 0.18)", marginBottom: "16px" }} />
            <div
              style={{
                display: "flex",
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: "italic",
                fontSize: "22px",
                color: "#6b5847",
                letterSpacing: "0.5px",
              }}
            >
              {`— Dari ${message.author}`}
            </div>
          </div>

          {/* Quiet Understated Branding */}
          <div
            style={{
              position: "absolute",
              bottom: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "12px",
              color: "rgba(113, 90, 72, 0.55)",
              letterSpacing: "8px",
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
      fonts: [
        {
          name: "Cormorant Garamond",
          data: cormorantRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Cormorant Garamond",
          data: cormorantItalic,
          style: "italic",
          weight: 400,
        },
      ],
    }
  );
}
