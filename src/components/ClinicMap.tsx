import React from 'react';
import { ViewStyle } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export interface MapMarker { lat: number; lng: number; title?: string; danger?: boolean }

interface Props {
  lat: number;
  lng: number;
  markers?: MapMarker[];
  style?: ViewStyle;
}

/** ネイティブ用マップ(iOS は Apple Maps、Android は Google Maps) */
export function ClinicMap({ lat, lng, markers = [], style }: Props) {
  return (
    <MapView
      style={style}
      region={{ latitude: lat, longitude: lng, latitudeDelta: 0.03, longitudeDelta: 0.03 }}
      showsUserLocation
    >
      {markers.map((m, i) => (
        <Marker key={i} coordinate={{ latitude: m.lat, longitude: m.lng }} title={m.title} pinColor={m.danger ? '#F0574E' : '#3B82F6'} />
      ))}
    </MapView>
  );
}

export default ClinicMap;
