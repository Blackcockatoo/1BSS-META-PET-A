import { ImageResponse } from 'next/og';
import { decodeMoss60Payload } from '@/lib/moss60/share';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

interface OGProps {
  params: Promise<{ token: string }>;
}

export default async function OpenGraphImage({ params }: OGProps) {
  const { token } = await params;
  const payload = decodeMoss60Payload(token);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#020617',
          color: '#f8fafc',
          padding: 48,
          fontSize: 38,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 28, color: '#22d3ee' }}>MOSS60 Studio Share</div>
          <div>{payload ? payload.metadata.id : 'Invalid payload'}</div>
          <div style={{ fontSize: 24, color: '#94a3b8' }}>
            {payload ? `${payload.metadata.scheme} · ${payload.metadata.variant}` : 'Unavailable'}
          </div>
        </div>
        <div style={{ fontSize: 18, color: '#67e8f9' }}>Verifiable metadata attached</div>
      </div>
    ),
    size
  );
}
