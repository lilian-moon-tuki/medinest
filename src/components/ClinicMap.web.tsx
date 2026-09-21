import React from 'react';
import { View, ViewStyle } from 'react-native';

export interface MapMarker { lat: number; lng: number; title?: string; danger?: boolean }

interface Props {
  lat: number;
  lng: number;
  markers?: MapMarker[];
  style?: ViewStyle;
}

/** Web 用マップ:API キー不要・iframe 埋め込み可能な OpenStreetMap */
export function ClinicMap({ lat, lng, style }: Props) {
  const dLng = 0.012;
  const dLat = 0.008;
  const bbox = `${lng - dLng}%2C${lat - dLat}%2C${lng + dLng}%2C${lat + dLat}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <View style={style}>
      {React.createElement('iframe', {
        src,
        title: 'map',
        style: { border: 0, width: '100%', height: '100%', display: 'block' },
        loading: 'lazy',
      })}
    </View>
  );
}

export default ClinicMap;
