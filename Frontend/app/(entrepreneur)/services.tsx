import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert, ActivityIndicator, RefreshControl, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { GradientButton } from '@/components/ui/gradient-button';
import { servicesService } from '@/services/services.service';
import type { ServiceItem } from '@/services/professionals.service';

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '' });

  const fetchServices = useCallback(async () => {
    try {
      const data = await servicesService.getMyServices();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const onRefresh = useCallback(() => { setRefreshing(true); fetchServices(); }, [fetchServices]);

  const openAdd = () => {
    setForm({ name: '', description: '', price: '', duration: '' });
    setEditId(null);
    setModalVisible(true);
  };

  const openEdit = (svc: ServiceItem) => {
    setForm({
      name: svc.name,
      description: svc.description ?? '',
      price: String(svc.price),
      duration: String(svc.duration_min),
    });
    setEditId(svc.id);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price.trim() || !form.duration.trim()) {
      Alert.alert('Atenção', 'Preencha o nome, o preço e a duração.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: parseFloat(form.price) || 0,
        duration_min: parseInt(form.duration) || 30,
      };
      if (editId) {
        await servicesService.updateService(editId, payload);
      } else {
        await servicesService.createService(payload);
      }
      setModalVisible(false);
      fetchServices();
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Remover Serviço', 'Deseja remover este serviço?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await servicesService.deleteService(id);
            fetchServices();
          } catch (err: any) {
            Alert.alert('Erro', err.message);
          }
        },
      },
    ]);
  };

  const FIELDS = [
    { label: 'Nome do Serviço *', key: 'name', placeholder: 'Ex: Corte Masculino', keyboard: 'default' },
    { label: 'Descrição', key: 'description', placeholder: 'Descrição do serviço...', keyboard: 'default' },
    { label: 'Preço (R$) *', key: 'price', placeholder: '0.00', keyboard: 'decimal-pad' },
    { label: 'Duração (min) *', key: 'duration', placeholder: 'Ex: 45', keyboard: 'number-pad' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Meus Serviços</Text>
          <Text style={styles.headerSub}>
            {services.length} serviço{services.length !== 1 ? 's' : ''} cadastrado{services.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openAdd}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando serviços...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        >
          {services.length === 0 ? (
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="cut-outline" size={48} color={Colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Nenhum serviço ainda</Text>
              <Text style={styles.emptyText}>Toque no + para adicionar seu primeiro serviço</Text>
              <TouchableOpacity style={styles.emptyAddBtn} onPress={openAdd}>
                <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={styles.emptyAddGrad}>
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.emptyAddTxt}>Adicionar Serviço</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            services.map((svc) => (
              <View key={svc.id} style={styles.svcCard}>
                <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={styles.svcAccent}>
                  <Ionicons name="cut" size={16} color="#fff" />
                </LinearGradient>
                <View style={styles.svcInfo}>
                  <Text style={styles.svcName}>{svc.name}</Text>
                  {svc.description ? (
                    <Text style={styles.svcDesc} numberOfLines={1}>{svc.description}</Text>
                  ) : null}
                  <View style={styles.svcMeta}>
                    <View style={styles.metaChip}>
                      <Ionicons name="time-outline" size={11} color={Colors.textMuted} />
                      <Text style={styles.metaTxt}>{svc.duration_min} min</Text>
                    </View>
                    <View style={[styles.metaChip, { backgroundColor: Colors.infoLight }]}>
                      <Text style={[styles.metaTxt, { color: Colors.primary, fontWeight: '700' }]}>
                        R$ {svc.price}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.svcActions}>
                  <TouchableOpacity style={styles.svcActionBtn} onPress={() => openEdit(svc)}>
                    <Ionicons name="pencil-outline" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.svcActionBtn, { backgroundColor: Colors.errorLight }]}
                    onPress={() => handleDelete(svc.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* FAB */}
      {services.length > 0 && (
        <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 80 }]} onPress={openAdd}>
          <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={styles.fabGradient}>
            <Ionicons name="add" size={28} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Modal — usa overlay em vez de pageSheet para funcionar no web */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setModalVisible(false)} />

          <View style={styles.modalSheet}>
            {/* Handle */}
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{editId ? 'Editar Serviço' : 'Novo Serviço'}</Text>

            {/* Campos — ScrollView garante que apareçam mesmo em telas pequenas */}
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {FIELDS.map((field) => (
                <View key={field.key} style={styles.formGroup}>
                  <Text style={styles.formLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.formInput}
                    value={(form as any)[field.key]}
                    onChangeText={(v) => setForm((f) => ({ ...f, [field.key]: v }))}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.textMuted}
                    keyboardType={field.keyboard as any}
                    returnKeyType="next"
                  />
                </View>
              ))}
            </ScrollView>

            {/* Botões — sempre visíveis fora do scroll */}
            <View style={[styles.modalActions, { paddingBottom: insets.bottom + 8 }]}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelTxt}>Cancelar</Text>
              </TouchableOpacity>
              {saving ? (
                <View style={[styles.cancelBtn, { flex: 1, backgroundColor: Colors.primary, borderColor: Colors.primary }]}>
                  <ActivityIndicator color="#fff" />
                </View>
              ) : (
                <GradientButton
                  title={editId ? 'Salvar' : 'Adicionar'}
                  onPress={handleSave}
                  fullWidth={false}
                  style={{ flex: 1 }}
                />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  addButton: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.md,
  },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: 120, paddingTop: Spacing.sm },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: Colors.textSecondary },
  emptyWrap: { alignItems: 'center', paddingVertical: 60, gap: 14 },
  emptyIconWrap: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', ...Shadow.sm,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  emptyText: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },
  emptyAddBtn: { borderRadius: BorderRadius.md, overflow: 'hidden', marginTop: 4 },
  emptyAddGrad: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 12 },
  emptyAddTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  svcCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, overflow: 'hidden', ...Shadow.sm,
  },
  svcAccent: { width: 48, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  svcInfo: { flex: 1, padding: Spacing.md, gap: 2 },
  svcName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  svcDesc: { fontSize: 12, color: Colors.textSecondary },
  svcMeta: { flexDirection: 'row', gap: 6, marginTop: 6 },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.background, paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full,
  },
  metaTxt: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  svcActions: { flexDirection: 'row', gap: 6, paddingRight: Spacing.sm },
  svcActionBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: Colors.infoLight, alignItems: 'center', justifyContent: 'center',
  },
  fab: { position: 'absolute', right: Spacing.lg },
  fabGradient: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', ...Shadow.lg },

  // Modal com overlay transparente
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    maxHeight: '90%',
    // sombra
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 20,
    elevation: 20,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border, alignSelf: 'center', marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 20, fontWeight: '800', color: Colors.textPrimary,
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm,
  },
  modalScroll: { flexGrow: 0 },
  modalContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, gap: Spacing.md },
  formGroup: {},
  formLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  formInput: {
    height: 50, backgroundColor: Colors.background, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md,
    fontSize: 14, color: Colors.textPrimary,
  },
  modalActions: {
    flexDirection: 'row', gap: Spacing.sm,
    padding: Spacing.lg,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  cancelBtn: {
    flex: 1, height: 52, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  cancelTxt: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
});
