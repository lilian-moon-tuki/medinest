import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Card } from '../src/components/Card';
import { ClinicMap, MapMarker } from '../src/components/ClinicMap';
import { colors, radius, spacing, shadows } from '../src/theme';
import { useClinics, SpecialtyTag } from '../src/data/localized';
import { useApp } from '../src/store/app';
import { useT } from '../src/i18n';

const FILTER_TAGS: (SpecialtyTag | undefined)[] = [undefined, 'internal', 'pediatrics', 'dental'];

const { width } = Dimensions.get('window');
const DEFAULT = { lat: 35.0116, lng: 135.7681 }; // 京都

export default function ClinicsScreen() {
  const t = useT();
  const locationLabel = useApp((s) => s.locationLabel);
  const setLocationLabel = useApp((s) => s.setLocationLabel);
  const [coords, setCoords] = useState(DEFAULT);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  const filters = [t('clinics.nearby'), t('clinics.internal'), t('clinics.pediatrics'), t('clinics.dental')];
  const clinics = useClinics(FILTER_TAGS[active]);

  const markers: MapMarker[] = [
    { lat: coords.lat, lng: coords.lng, title: locationLabel ?? '', danger: true },
    ...clinics.map((c, i) => ({ lat: coords.lat + (i - 1) * 0.006, lng: coords.lng + (i % 2 === 0 ? 0.007 : -0.006), title: c.name })),
  ];

  const getLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationLabel(t('clinics.locationDenied'));
        setLoading(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      try {
        const geo = await Location.reverseGeocodeAsync({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        const g = geo[0];
        setLocationLabel(g ? [g.city, g.district, g.street].filter(Boolean).join(' ') || `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}` : `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`);
      } catch {
        setLocationLabel(`${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`);
      }
    } catch {
      setLocationLabel(t('clinics.locationDenied'));
    }
    setLoading(false);
  };

  useEffect(() => { getLocation(); }, []);

  const openInMaps = (query: string) => {
    const q = encodeURIComponent(query);
    Linking.openURL(`https://www.google.com/maps/search/${q}/@${coords.lat},${coords.lng},15z`);
  };

  return (
    <View style={styles.root}>
      <ClinicMap lat={coords.lat} lng={coords.lng} markers={markers} style={styles.map} />

      <SafeAreaView style={styles.overlay} edges={['top']} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Pressable style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Pressable style={styles.mapsBtn} onPress={() => openInMaps('クリニック 病院')}>
            <Ionicons name="map" size={16} color={colors.white} />
            <Text style={styles.mapsBtnText}> {t('clinics.openInMaps')}</Text>
          </Pressable>
        </View>

        <View style={styles.search}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>{t('clinics.searchPlaceholder')}</Text>
          <Ionicons name="mic-outline" size={20} color={colors.textSecondary} />
        </View>

        <Pressable style={styles.locBar} onPress={getLocation}>
          {loading ? <ActivityIndicator size="small" color={colors.primary} /> : <Ionicons name="navigate-circle" size={20} color={colors.primary} />}
          <Text style={styles.locText} numberOfLines={1}>
            {loading ? t('clinics.gettingLocation') : locationLabel ?? t('clinics.selectLocation')}
          </Text>
          <Ionicons name="refresh" size={16} color={colors.textTertiary} />
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((f, i) => (
            <Pressable key={f} style={[styles.filter, active === i && styles.filterActive]} onPress={() => setActive(i)}>
              <Text style={[styles.filterText, active === i && styles.filterTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>

      <View style={styles.carousel} pointerEvents="box-none">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={width * 0.82 + spacing.lg} decelerationRate="fast" contentContainerStyle={{ paddingHorizontal: spacing.xl }}>
          {clinics.map((c) => (
            <Card key={c.id} style={styles.clinicCard}>
              <View style={styles.clinicHeader}>
                <Text style={styles.clinicName}>{c.name}</Text>
                <Text style={styles.distance}>{c.distanceKm}km {t('clinics.away')}</Text>
              </View>
              <Text style={styles.address}>{c.address}</Text>
              <View style={styles.clinicMeta}>
                <View style={styles.metaBox}>
                  <Text style={styles.metaLabel}>{t('clinics.waiting')}</Text>
                  <View style={styles.waitRow}>
                    <Ionicons name="people" size={16} color={colors.primary} />
                    <Text style={styles.waitText}> {c.waiting}{t('clinics.people')}</Text>
                  </View>
                </View>
                <View style={styles.metaBox}>
                  <Text style={styles.metaLabel}>{t('clinics.specialtyLabel')}</Text>
                  <Text style={styles.metaValue}>{c.department}</Text>
                </View>
              </View>
              <Pressable style={styles.navBtn} onPress={() => openInMaps(c.name + ' ' + c.address)}>
                <Ionicons name="navigate" size={16} color={colors.white} />
                <Text style={styles.navBtnText}> {t('clinics.openInMaps')}</Text>
              </Pressable>
            </Card>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#E8EDF2' },
  map: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },

  overlay: { paddingHorizontal: spacing.xl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...(shadows.card as object) },
  mapsBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: spacing.lg, height: 40, borderRadius: radius.pill, ...(shadows.floating as object) },
  mapsBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },

  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: spacing.lg, height: 52, marginTop: spacing.lg, ...(shadows.card as object) },
  searchPlaceholder: { flex: 1, marginHorizontal: spacing.md, fontSize: 16, color: colors.textSecondary },

  locBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: spacing.lg, height: 46, marginTop: spacing.md, ...(shadows.soft as object) },
  locText: { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: '600' },

  filterRow: { gap: spacing.md, paddingVertical: spacing.lg, paddingRight: spacing.xl },
  filter: { paddingHorizontal: spacing.xl, height: 44, borderRadius: radius.pill, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...(shadows.soft as object) },
  filterActive: { backgroundColor: colors.primary },
  filterText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  filterTextActive: { color: colors.white },

  carousel: { position: 'absolute', bottom: spacing['3xl'], left: 0, right: 0 },
  clinicCard: { width: width * 0.82, marginRight: spacing.lg },
  clinicHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  clinicName: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, flexShrink: 1 },
  distance: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  address: { fontSize: 15, color: colors.textPrimary, marginTop: spacing.sm },
  clinicMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  metaBox: { flex: 1, backgroundColor: colors.cardMuted, borderRadius: radius.md, padding: spacing.lg },
  metaLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  waitRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  waitText: { fontSize: 15, fontWeight: '800', color: colors.primary },
  metaValue: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginTop: spacing.xs },
  navBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, height: 46, borderRadius: radius.pill, marginTop: spacing.lg },
  navBtnText: { color: colors.white, fontWeight: '800', fontSize: 15 },
});
