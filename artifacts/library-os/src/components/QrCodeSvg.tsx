import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function QrCodeSvg({
  data = "",
  size = 200,
  className = "",
}: {
  data?: string;
  size?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;
    QRCode.toCanvas(canvasRef.current, data, {
      width: size,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });
  }, [data, size]);

  if (!data) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
        <rect width={size} height={size} fill="#eee" rx={4} />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="#999" fontSize={12}>
          No QR data
        </text>
      </svg>
    );
  }

  return <canvas ref={canvasRef} className={className} style={{ width: size, height: size }} />;
}
