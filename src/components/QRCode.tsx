import React from 'react';
import Svg, { Rect } from 'react-native-svg';

/** 見た目用の擬似 QR コード(seed から決定的に生成)。実データではない。 */
export function QRCode({ size = 160, seed = 'medinest', color = '#1A1D26', bg = '#FFFFFF' }: { size?: number; seed?: string; color?: string; bg?: string }) {
  const N = 25;
  const cell = size / N;

  // 簡易ハッシュで各セルの on/off を決定
  const on = (x: number, y: number) => {
    let h = 2166136261;
    const s = `${seed}-${x}-${y}`;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) % 100 < 48;
  };

  // ファインダーパターン(3隅の四角)
  const finder = (ox: number, oy: number) => (
    <>
      <Rect x={ox * cell} y={oy * cell} width={cell * 7} height={cell * 7} fill={color} />
      <Rect x={(ox + 1) * cell} y={(oy + 1) * cell} width={cell * 5} height={cell * 5} fill={bg} />
      <Rect x={(ox + 2) * cell} y={(oy + 2) * cell} width={cell * 3} height={cell * 3} fill={color} />
    </>
  );

  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);

  const dots: React.ReactNode[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (inFinder(x, y)) continue;
      if (on(x, y)) dots.push(<Rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={color} />);
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x={0} y={0} width={size} height={size} fill={bg} />
      {dots}
      {finder(0, 0)}
      {finder(N - 7, 0)}
      {finder(0, N - 7)}
    </Svg>
  );
}

export default QRCode;
