// Mock data for NaHora app
export type ServiceCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Professional = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  distance: string;
  startingPrice: number;
  avatar: string;
  category: string;
  about: string;
  location: string;
  services: Service[];
  reviews: Review[];
  availableSlots: string[];
};

export type Service = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  image?: string;
};

export type Review = {
  id: string;
  clientName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
};

export type Appointment = {
  id: string;
  professionalName: string;
  professionalAvatar: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  price: number;
  location: string;
};

export type Notification = {
  id: string;
  type: 'booking' | 'cancellation' | 'confirmation' | 'reminder';
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export const CATEGORIES: ServiceCategory[] = [
  { id: '1', name: 'Barbeiro', icon: 'cut', color: '#6C63FF' },
  { id: '2', name: 'Manicure', icon: 'hand-sparkles', color: '#EC4899' },
  { id: '3', name: 'Cabeleireiro', icon: 'spa', color: '#F59E0B' },
  { id: '4', name: 'Massagem', icon: 'hand-holding-heart', color: '#10B981' },
  { id: '5', name: 'Consultoria', icon: 'briefcase', color: '#3B82F6' },
  { id: '6', name: 'Estética', icon: 'star', color: '#EF4444' },
];

export const PROFESSIONALS: Professional[] = [
  {
    id: '1',
    name: 'Carlos Mendes',
    specialty: 'Barbeiro Profissional',
    rating: 4.9,
    reviewCount: 312,
    distance: '0.8 km',
    startingPrice: 35,
    avatar: 'CM',
    category: 'Barbeiro',
    about: 'Especialista em cortes masculinos modernos, barba e degradê. Mais de 8 anos de experiência com técnicas nacionais e internacionais.',
    location: 'Rua das Flores, 123 — Centro',
    services: [
      { id: 's1', name: 'Corte Masculino', description: 'Corte moderno com acabamento', duration: '45 min', price: 35 },
      { id: 's2', name: 'Barba Completa', description: 'Modelagem + hidratação', duration: '30 min', price: 25 },
      { id: 's3', name: 'Corte + Barba', description: 'Combo completo', duration: '60 min', price: 55 },
      { id: 's4', name: 'Degradê', description: 'Degradê moderno', duration: '45 min', price: 40 },
    ],
    reviews: [
      { id: 'r1', clientName: 'João S.', avatar: 'JS', rating: 5, comment: 'Melhor barbeiro da cidade! Sempre satisfeito.', date: '2 dias atrás' },
      { id: 'r2', clientName: 'Pedro M.', avatar: 'PM', rating: 5, comment: 'Atendimento impecável, ambiente limpo e moderno.', date: '5 dias atrás' },
      { id: 'r3', clientName: 'Lucas A.', avatar: 'LA', rating: 4, comment: 'Ótimo corte, chegou no horário marcado.', date: '1 semana atrás' },
    ],
    availableSlots: ['09:00', '09:45', '10:30', '11:15', '14:00', '14:45', '15:30', '16:15', '17:00'],
  },
  {
    id: '2',
    name: 'Ana Paula Lima',
    specialty: 'Nail Designer',
    rating: 4.8,
    reviewCount: 248,
    distance: '1.2 km',
    startingPrice: 45,
    avatar: 'AL',
    category: 'Manicure',
    about: 'Especialista em nail art, gel e unhas de fibra. Trabalho com produtos importados de alta qualidade para resultados duradouros.',
    location: 'Av. Brasil, 456 — Jardins',
    services: [
      { id: 's5', name: 'Manicure Simples', description: 'Esmaltação e cuidados', duration: '40 min', price: 45 },
      { id: 's6', name: 'Gel Completo', description: 'Gel com nail art', duration: '90 min', price: 120 },
      { id: 's7', name: 'Pedicure', description: 'Cuidado completo dos pés', duration: '50 min', price: 55 },
    ],
    reviews: [
      { id: 'r4', clientName: 'Maria L.', avatar: 'ML', rating: 5, comment: 'As unhas ficaram perfeitas! Super delicada e cuidadosa.', date: '1 dia atrás' },
    ],
    availableSlots: ['10:00', '11:00', '14:00', '15:30', '16:30'],
  },
  {
    id: '3',
    name: 'Fernanda Costa',
    specialty: 'Cabeleireira & Colorista',
    rating: 4.7,
    reviewCount: 189,
    distance: '2.1 km',
    startingPrice: 80,
    avatar: 'FC',
    category: 'Cabeleireiro',
    about: 'Especialista em coloração, mechas e tratamentos capilares. Formada pelo L\'Oréal Academy Paris.',
    location: 'Rua Pinheiros, 789 — Pinheiros',
    services: [
      { id: 's8', name: 'Corte Feminino', description: 'Corte + escova', duration: '60 min', price: 80 },
      { id: 's9', name: 'Coloração', description: 'Tintura completa', duration: '120 min', price: 180 },
      { id: 's10', name: 'Mechas', description: 'Mechas + hidratação', duration: '150 min', price: 250 },
    ],
    reviews: [
      { id: 'r5', clientName: 'Carla B.', avatar: 'CB', rating: 5, comment: 'Perfeita! A coloração ficou exatamente como eu queria.', date: '3 dias atrás' },
    ],
    availableSlots: ['09:30', '11:00', '14:30', '16:00'],
  },
  {
    id: '4',
    name: 'Ricardo Santos',
    specialty: 'Terapeuta Corporal',
    rating: 4.9,
    reviewCount: 156,
    distance: '3.0 km',
    startingPrice: 120,
    avatar: 'RS',
    category: 'Massagem',
    about: 'Terapeuta holístico com 10 anos de experiência em massoterapia, shiatsu e reflexologia.',
    location: 'Rua Augusta, 321 — Consolação',
    services: [
      { id: 's11', name: 'Massagem Relaxante', description: '60 minutos de relaxamento', duration: '60 min', price: 120 },
      { id: 's12', name: 'Shiatsu', description: 'Técnica japonesa', duration: '50 min', price: 130 },
    ],
    reviews: [
      { id: 'r6', clientName: 'Roberto F.', avatar: 'RF', rating: 5, comment: 'Melhor massagem que já fiz! Altamente recomendado.', date: '2 dias atrás' },
    ],
    availableSlots: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
  },
];

export const MY_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    professionalName: 'Carlos Mendes',
    professionalAvatar: 'CM',
    service: 'Corte + Barba',
    date: 'Hoje',
    time: '14:30',
    status: 'confirmed',
    price: 55,
    location: 'Rua das Flores, 123',
  },
  {
    id: 'a2',
    professionalName: 'Ana Paula Lima',
    professionalAvatar: 'AL',
    service: 'Gel Completo',
    date: 'Amanhã',
    time: '10:00',
    status: 'pending',
    price: 120,
    location: 'Av. Brasil, 456',
  },
  {
    id: 'a3',
    professionalName: 'Fernanda Costa',
    professionalAvatar: 'FC',
    service: 'Mechas',
    date: '15 Mai',
    time: '09:30',
    status: 'confirmed',
    price: 250,
    location: 'Rua Pinheiros, 789',
  },
  {
    id: 'a4',
    professionalName: 'Ricardo Santos',
    professionalAvatar: 'RS',
    service: 'Massagem Relaxante',
    date: '02 Mai',
    time: '15:00',
    status: 'completed',
    price: 120,
    location: 'Rua Augusta, 321',
  },
  {
    id: 'a5',
    professionalName: 'Carlos Mendes',
    professionalAvatar: 'CM',
    service: 'Corte Masculino',
    date: '28 Abr',
    time: '11:00',
    status: 'cancelled',
    price: 35,
    location: 'Rua das Flores, 123',
  },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'confirmation', title: 'Agendamento Confirmado!', message: 'Carlos Mendes confirmou seu horário às 14:30 de hoje.', time: '5 min atrás', read: false },
  { id: 'n2', type: 'reminder', title: 'Lembrete de Amanhã', message: 'Você tem manicure com Ana Paula amanhã às 10:00.', time: '1h atrás', read: false },
  { id: 'n3', type: 'booking', title: 'Novo Agendamento', message: 'Seu agendamento com Fernanda Costa foi realizado com sucesso.', time: '2h atrás', read: true },
  { id: 'n4', type: 'cancellation', title: 'Agendamento Cancelado', message: 'Seu agendamento de 28/Abr foi cancelado. Reagende quando quiser.', time: '3 dias atrás', read: true },
];

// Entrepreneur mock data
export const ENTREPRENEUR_STATS = {
  weekRevenue: 1840,
  weekClients: 28,
  weekAppointments: 32,
  monthRevenue: 7200,
  chartData: [320, 480, 260, 590, 420, 680, 350],
  chartLabels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
};

export const TODAY_APPOINTMENTS = [
  { id: 'ta1', clientName: 'João Silva', clientAvatar: 'JS', service: 'Corte + Barba', time: '09:00', status: 'confirmed' as const, price: 55 },
  { id: 'ta2', clientName: 'Pedro Melo', clientAvatar: 'PM', service: 'Corte Masculino', time: '09:45', status: 'confirmed' as const, price: 35 },
  { id: 'ta3', clientName: 'Lucas Alves', clientAvatar: 'LA', service: 'Barba', time: '10:30', status: 'pending' as const, price: 25 },
  { id: 'ta4', clientName: 'Rafael Costa', clientAvatar: 'RC', service: 'Degradê', time: '11:15', status: 'confirmed' as const, price: 40 },
  { id: 'ta5', clientName: 'Bruno Lima', clientAvatar: 'BL', service: 'Corte + Barba', time: '14:00', status: 'confirmed' as const, price: 55 },
];

export const MY_SERVICES: Service[] = [
  { id: 'ms1', name: 'Corte Masculino', description: 'Corte moderno com acabamento perfeito', duration: '45 min', price: 35 },
  { id: 'ms2', name: 'Barba Completa', description: 'Modelagem e hidratação da barba', duration: '30 min', price: 25 },
  { id: 'ms3', name: 'Corte + Barba', description: 'Combo completo de corte e barba', duration: '60 min', price: 55 },
  { id: 'ms4', name: 'Degradê', description: 'Degradê moderno e estiloso', duration: '45 min', price: 40 },
  { id: 'ms5', name: 'Hidratação Capilar', description: 'Tratamento intensivo para os fios', duration: '30 min', price: 30 },
];
