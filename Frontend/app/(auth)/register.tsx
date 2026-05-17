import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Shadow, Typography } from '@/constants/theme';
import { GradientButton } from '@/components/ui/gradient-button';
import { useAuth } from '@/contexts/AuthContext';

type UserType = 'client' | 'entrepreneur';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>('client');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha nome, e-mail e senha.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), phone.trim(), password, userType);
    } catch (err: any) {
      Alert.alert('Erro ao criar conta', err.message || 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <LinearGradient
          colors={['#6C63FF', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Criar Conta</Text>
            <Text style={styles.headerSubtitle}>Junte-se ao NaHora gratuitamente</Text>
          </View>
        </LinearGradient>

        {/* Form */}
        <View style={styles.formCard}>
          {/* User Type Toggle */}
          <Text style={styles.sectionLabel}>Você é...</Text>
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[styles.toggleOption, userType === 'client' && styles.toggleActive]}
              onPress={() => setUserType('client')}
            >
              <Ionicons name="person" size={16} color={userType === 'client' ? '#fff' : Colors.textSecondary} />
              <Text style={[styles.toggleText, userType === 'client' && styles.toggleTextActive]}>
                Sou Cliente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleOption, userType === 'entrepreneur' && styles.toggleActive]}
              onPress={() => setUserType('entrepreneur')}
            >
              <Ionicons name="briefcase" size={16} color={userType === 'entrepreneur' ? '#fff' : Colors.textSecondary} />
              <Text style={[styles.toggleText, userType === 'entrepreneur' && styles.toggleTextActive]}>
                Sou Empreendedor
              </Text>
            </TouchableOpacity>
          </View>

          {/* Fields */}
          {[
            { label: 'Nome completo', value: name, setter: setName, icon: 'person-outline', placeholder: 'Seu nome completo', capitalize: 'words' as const },
            { label: 'E-mail', value: email, setter: setEmail, icon: 'mail-outline', placeholder: 'seu@email.com', keyboard: 'email-address' as const, capitalize: 'none' as const },
            { label: 'Telefone', value: phone, setter: setPhone, icon: 'call-outline', placeholder: '(11) 99999-9999', keyboard: 'phone-pad' as const },
          ].map((field) => (
            <View key={field.label} style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{field.label}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name={field.icon as any} size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.textMuted}
                  keyboardType={field.keyboard as any}
                  autoCapitalize={field.capitalize as any}
                  editable={!loading}
                />
              </View>
            </View>
          ))}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {userType === 'entrepreneur' && (
            <View style={styles.entrepreneurNote}>
              <Ionicons name="information-circle" size={16} color={Colors.primary} />
              <Text style={styles.entrepreneurNoteText}>
                Você poderá cadastrar seus serviços e gerenciar sua agenda após o cadastro.
              </Text>
            </View>
          )}

          {loading ? (
            <View style={[styles.loadingBtn, { marginTop: Spacing.md }]}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.loadingText}>Criando conta...</Text>
            </View>
          ) : (
            <GradientButton
              title="Criar minha conta"
              onPress={handleRegister}
              style={{ marginTop: Spacing.md }}
            />
          )}

          <Text style={styles.terms}>
            Ao criar sua conta, você concorda com nossos{' '}
            <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
            <Text style={styles.termsLink}>Política de Privacidade</Text>.
          </Text>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, paddingBottom: Spacing.xl },
  header: { height: 220, paddingHorizontal: Spacing.lg, paddingTop: 60, overflow: 'hidden' },
  circle1: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.08)', top: -40, right: -30 },
  circle2: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.06)', bottom: 10, right: 80 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  headerContent: {},
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  formCard: { backgroundColor: Colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -28, padding: Spacing.lg, paddingTop: Spacing.xl, flex: 1, ...Shadow.md },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  toggle: { flexDirection: 'row', backgroundColor: Colors.background, borderRadius: BorderRadius.md, padding: 4, marginBottom: Spacing.lg },
  toggleOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: BorderRadius.sm, gap: 6 },
  toggleActive: { backgroundColor: Colors.primary, ...Shadow.sm },
  toggleText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  toggleTextActive: { color: '#fff' },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md, height: 52 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  eyeButton: { padding: 4 },
  entrepreneurNote: { flexDirection: 'row', backgroundColor: Colors.infoLight, borderRadius: BorderRadius.sm, padding: Spacing.sm, gap: 8, marginBottom: Spacing.sm },
  entrepreneurNoteText: { flex: 1, fontSize: 12, color: Colors.primary, lineHeight: 18 },
  loadingBtn: { height: 52, borderRadius: BorderRadius.md, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  loadingText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  terms: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.md, lineHeight: 18 },
  termsLink: { color: Colors.primary, fontWeight: '600' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.lg },
  loginText: { fontSize: 14, color: Colors.textSecondary },
  loginLink: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
});
