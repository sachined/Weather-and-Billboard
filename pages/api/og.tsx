import { ImageResponse } from 'next/og';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

function readFont(weight: 400 | 700): ArrayBuffer {
  const file = `inter-latin-${weight}-normal.woff`;
  const buf = fs.readFileSync(
    path.join(process.cwd(), 'node_modules', '@fontsource', 'inter', 'files', file)
  );
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title: rawTitle, series, position } = req.query;
  const title = typeof rawTitle === 'string' ? rawTitle : 'Sachin Nediyanchath';
  const fontSize = title.length > 50 ? 52 : title.length > 30 ? 64 : 76;

  const interRegular = readFont(400);
  const interBold = readFont(700);

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0f172a',
          padding: '60px 72px',
          position: 'relative',
          fontFamily: 'Inter',
        }}
      >
        {/* Cyan accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: '#38bdf8',
            display: 'flex',
          }}
        />

        {/* Series badge */}
        {series && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '6px',
                padding: '6px 16px',
              }}
            >
              <span style={{ color: '#38bdf8', fontSize: '20px', fontWeight: 700 }}>
                {series}
              </span>
            </div>
            {position && (
              <span style={{ color: '#64748b', fontSize: '20px' }}>
                Part {position}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              color: '#f1f5f9',
              fontSize: `${fontSize}px`,
              fontWeight: 700,
              lineHeight: 1.15,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ color: '#e2e8f0', fontSize: '22px', fontWeight: 700 }}>
            Sachin Nediyanchath
          </span>
          <span style={{ color: '#475569', fontSize: '18px' }}>
            finsurf.net/blog
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400 },
        { name: 'Inter', data: interBold, weight: 700 },
      ],
    }
  );

  const buffer = await imageResponse.arrayBuffer();
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, immutable, no-transform, max-age=31536000');
  res.send(Buffer.from(buffer));
}
