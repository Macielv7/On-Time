import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { GradientButton } from '@/components/ui/gradient-button';
import { MY_SERVICES, type Service } from '@/constants/mock-data';

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const [services, setServices] = useState<Service[]>(MY_SERVICES);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '' });

  const openAdd = () => {
    setForm({ name: '', description: '', price: '', duration: '' });
    setEditMode(false);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) {
      Alert.alert('Atenção', 'Preencha o nome e o preço.');
      return;
    }
    const newService: Service = {
      id: `s_${Date.now()}`,
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      duration: form.duration || '30 min',
    };
    setServices((prev) => [newService, ...prev]);
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Remover Serviço', 'Deseja remover este serviço?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => setServices((prev) => prev.filter((s) => s.id !== id)) },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Meus Serviços</Text>
          <Text style={styles.headerSub}>{services.length} serviços cadastrados</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openAdd}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {services.map((svc) => (
          <View key={svc.id} style={styles.svcCard}>
            <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={styles.svcAccent}>
              <Ionicons name="cut" size={16} color="#fff" />
            </LinearGradient>
            <View style={styles.svcInfo}>
              <Text style={styles.svcName}>{svc.name}</Text>
              <Text style={styles.svcDesc} numberOfLines={1}>{svc.description}</Text>
              <View style={styles.svcMeta}>
                <View style={styles.metaChip}>
                  <Ionicons name="time-outline" size={11} color={Colors.textMuted} />
                  <Text style={styles.metaTxt}>{svc.duration}</Text>
                </View>
                <View style={[styles.metaChip, { backgroundColor: Colors.infoLight }]}>
                  <Text style={[styles.metaTxt, { color: Colors.primary, fontWeight: '700' }]}>R$ {svc.price}</Text>
                </View>
              </View>
            </View>
            <View style={styles.svcActions}>
              <TouchableOpacity style={styles.svcActionBtn} onPress={() => { setForm({ name: svc.name, description: svc.description, price: `${svc.price}`, duration: svc.duration }); setEditMode(true); setModalVisible(true); }}>
                <Ionicons name="pencil-outline" size={16} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.svcActionBtn, { backgroundColor: Colors.errorLight }]} onPress={() => handleDelete(svc.id)}>
                <Ionicons name="trash-outline" size={16} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 80 }]} onPress={openAdd}>
        <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={styles.fabGradient}>
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{editMode ? 'Editar Serviço' : 'Novo Serviço'}</Text>

          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            {/* Upload placeholder */}
            <TouchableOpacity style={styles.uploadArea}>
              <Ionicons name="camera-outline" size={28} color={Colors.textMuted} />
              <Text style={styles.uploadText}>Adicionar foto do serviço</Text>
              <Text style={styles.uploadSub}>Toque para selecionar</Text>
            </TouchableOpacity>

            {[
              { label: 'Nome do Serviço *', key: 'name', placeholder: 'Ex: Corte Masculino' },
              { label: 'Descrição', key: 'description', placeholder: 'Descrição do serviço...' },
              { label: 'Preço (R$) *', key: 'price', placeholder: '0,00', keyboard: 'numeric' },
              { label: 'Duração', key: 'duration', placeholder: 'Ex: 45 min' },
            ].map((field) => (
              <View key={field.key} style={styles.formGroup}>
                <Text style={styles.formLabel}>{field.label}</Text>
                <TextInput
                  style={styles.formInput}
                  value={(form as any)[field.key]}
                  onChangeText={(v) => setForm((f) => ({ ...f, [field.key]: v }))}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.textMuted}
                  keyboardType={(field.keyboard as any) || 'default'}
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelTxt}>Cancelar</Text>
            </TouchableOpacity>
            <GradientButton title={editMode ? 'Salvar' : 'Adicionar'} onPress={handleSave} fullWidth={false} style={{ flex: 1 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  addButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.md },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: 120 },
  svcCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, overflow: 'hidden', ...Shadow.sm },
  svcAccent: { width: 48, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  svcInfo: { flex: 1, padding: Spacing.md, gap: 2 },
  svcName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  svcDesc: { fontSize: 12, color: Colors.textSecondary },
  svcMeta: { flexDirection: 'row', gap: 6, marginTop: 6 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.background, paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  metaTxt: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  svcActions: { flexDirection: 'row', gap: 6, paddingRight: Spacing.sm },
  svcActionBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.infoLight, alignItems: 'center', justifyContent: 'center' },
  fab: { position: 'absolute', right: Spacing.lg },
  fabGradient: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', ...Shadow.lg },
  modal: { flex: 1, backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: Spacing.md },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  modalContent: { paddingHorizontal: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xl },
  uploadArea: { height: 130, borderRadius: BorderRadius.lg, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.background },
  uploadText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  uploadSub: { fontSize: 12, color: Colors.textMuted },
  formGroup: {},
  formLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  formInput: { height: 50, backgroundColor: Colors.background, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md, fontSize: 14, color: Colors.textPrimary },
  modalActions: { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border },
  cancelBtn: { flex: 1, height: 52, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  cancelTxt: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
});
