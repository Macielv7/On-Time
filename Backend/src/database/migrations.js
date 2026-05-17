// src/database/migrations.js
// Cria todas as tabelas do banco NaHora

const { dbRun } = require('./connection');

async function runMigrations() {
  console.log('⚙️  Executando migrations...');

  // ─────────────────────────────────────────────────
  // TABELA: categories
  // ─────────────────────────────────────────────────
  await dbRun(`
    CREATE TABLE IF NOT EXISTS categories (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL UNIQUE,
      icon       TEXT    NOT NULL,
      color      TEXT    NOT NULL DEFAULT '#6C63FF',
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ─────────────────────────────────────────────────
  // TABELA: users
  // ─────────────────────────────────────────────────
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,
      email         TEXT    NOT NULL UNIQUE,
      phone         TEXT,
      password_hash TEXT    NOT NULL,
      role          TEXT    NOT NULL CHECK(role IN ('client','entrepreneur')) DEFAULT 'client',
      avatar_url    TEXT,
      is_active     INTEGER NOT NULL DEFAULT 1,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ─────────────────────────────────────────────────
  // TABELA: professionals
  // (perfil detalhado do empreendedor — 1:1 com users)
  // ─────────────────────────────────────────────────
  await dbRun(`
    CREATE TABLE IF NOT EXISTS professionals (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL UNIQUE,
      category_id     INTEGER NOT NULL,
      bio             TEXT,
      specialty       TEXT    NOT NULL,
      address         TEXT,
      city            TEXT,
      latitude        REAL,
      longitude       REAL,
      rating_avg      REAL    NOT NULL DEFAULT 0.0,
      rating_count    INTEGER NOT NULL DEFAULT 0,
      is_accepting    INTEGER NOT NULL DEFAULT 1,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    )
  `);

  // ─────────────────────────────────────────────────
  // TABELA: services
  // ─────────────────────────────────────────────────
  await dbRun(`
    CREATE TABLE IF NOT EXISTS services (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      professional_id INTEGER NOT NULL,
      name            TEXT    NOT NULL,
      description     TEXT,
      price           REAL    NOT NULL CHECK(price >= 0),
      duration_min    INTEGER NOT NULL CHECK(duration_min > 0),
      image_url       TEXT,
      is_active       INTEGER NOT NULL DEFAULT 1,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE
    )
  `);

  // ─────────────────────────────────────────────────
  // TABELA: availability_slots
  // (disponibilidade semanal do profissional)
  // ─────────────────────────────────────────────────
  await dbRun(`
    CREATE TABLE IF NOT EXISTS availability_slots (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      professional_id INTEGER NOT NULL,
      day_of_week     INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),
      start_time      TEXT    NOT NULL,
      end_time        TEXT    NOT NULL,
      is_active       INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE
    )
  `);

  // ─────────────────────────────────────────────────
  // TABELA: appointments
  // ─────────────────────────────────────────────────
  await dbRun(`
    CREATE TABLE IF NOT EXISTS appointments (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id       INTEGER NOT NULL,
      professional_id INTEGER NOT NULL,
      service_id      INTEGER NOT NULL,
      scheduled_date  TEXT    NOT NULL,
      scheduled_time  TEXT    NOT NULL,
      status          TEXT    NOT NULL
                      CHECK(status IN ('pending','confirmed','completed','cancelled'))
                      DEFAULT 'pending',
      payment_method  TEXT    CHECK(payment_method IN ('mercado_pago','credit_card','cash')),
      total_price     REAL    NOT NULL CHECK(total_price >= 0),
      notes           TEXT,
      cancelled_by    INTEGER,
      cancelled_at    TEXT,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (client_id)       REFERENCES users(id)         ON DELETE CASCADE,
      FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id)      REFERENCES services(id)      ON DELETE RESTRICT
    )
  `);

  // ─────────────────────────────────────────────────
  // TABELA: reviews
  // (avaliação pós-atendimento — 1:1 com appointment)
  // ─────────────────────────────────────────────────
  await dbRun(`
    CREATE TABLE IF NOT EXISTS reviews (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id  INTEGER NOT NULL UNIQUE,
      client_id       INTEGER NOT NULL,
      professional_id INTEGER NOT NULL,
      rating          INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment         TEXT,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (appointment_id)  REFERENCES appointments(id)  ON DELETE CASCADE,
      FOREIGN KEY (client_id)       REFERENCES users(id)         ON DELETE CASCADE,
      FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE
    )
  `);

  // ─────────────────────────────────────────────────
  // TABELA: notifications
  // ─────────────────────────────────────────────────
  await dbRun(`
    CREATE TABLE IF NOT EXISTS notifications (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL,
      type            TEXT    NOT NULL
                      CHECK(type IN ('booking','cancellation','confirmation','reminder')),
      title           TEXT    NOT NULL,
      message         TEXT    NOT NULL,
      is_read         INTEGER NOT NULL DEFAULT 0,
      related_id      INTEGER,
      related_type    TEXT,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // ─────────────────────────────────────────────────
  // ÍNDICES para performance
  // ─────────────────────────────────────────────────
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_appointments_client    ON appointments(client_id)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_appointments_pro       ON appointments(professional_id)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_appointments_date      ON appointments(scheduled_date)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_appointments_status    ON appointments(status)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_services_pro           ON services(professional_id)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_notifications_user     ON notifications(user_id)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_reviews_pro            ON reviews(professional_id)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_professionals_category ON professionals(category_id)`);

  // ─────────────────────────────────────────────────
  // SEED: categorias iniciais
  // ─────────────────────────────────────────────────
  const { dbGet } = require('./connection');
  const catExists = await dbGet(`SELECT id FROM categories LIMIT 1`);
  if (!catExists) {
    const cats = [
      ['Barbeiro',      'cut',        '#6C63FF'],
      ['Manicure',      'palette',    '#EC4899'],
      ['Cabeleireiro',  'flower',     '#F59E0B'],
      ['Massagem',      'hand-right', '#10B981'],
      ['Consultoria',   'briefcase',  '#3B82F6'],
      ['Estética',      'star',       '#EF4444'],
    ];
    for (const [name, icon, color] of cats) {
      await dbRun(`INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)`, [name, icon, color]);
    }
    console.log('🌱 Categorias inseridas.');
  }

  // ─────────────────────────────────────────────────
  // SEED: profissionais e serviços de demonstração
  // ─────────────────────────────────────────────────
  const proExists = await dbGet(`SELECT id FROM users WHERE role = 'entrepreneur' LIMIT 1`);
  if (!proExists) {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('senha123', 10);

    const pros = [
      {
        name: 'Carlos Mendes', email: 'carlos@nahora.com', phone: '(11) 99999-0001',
        specialty: 'Barbeiro Profissional', bio: 'Especialista em cortes masculinos modernos, barba e degradê. Mais de 8 anos de experiência.',
        address: 'Rua das Flores, 123', city: 'São Paulo', categoryName: 'Barbeiro',
        rating_avg: 4.9, rating_count: 312,
        services: [
          { name: 'Corte Masculino', description: 'Corte moderno com acabamento', price: 35, duration_min: 45 },
          { name: 'Barba Completa', description: 'Modelagem + hidratação', price: 25, duration_min: 30 },
          { name: 'Corte + Barba', description: 'Combo completo', price: 55, duration_min: 60 },
          { name: 'Degradê', description: 'Degradê moderno', price: 40, duration_min: 45 },
        ],
      },
      {
        name: 'Ana Paula Lima', email: 'ana@nahora.com', phone: '(11) 99999-0002',
        specialty: 'Nail Designer', bio: 'Especialista em nail art, gel e unhas de fibra. Trabalho com produtos importados de alta qualidade.',
        address: 'Av. Brasil, 456', city: 'São Paulo', categoryName: 'Manicure',
        rating_avg: 4.8, rating_count: 248,
        services: [
          { name: 'Manicure Simples', description: 'Esmaltação e cuidados', price: 45, duration_min: 40 },
          { name: 'Gel Completo', description: 'Gel com nail art', price: 120, duration_min: 90 },
          { name: 'Pedicure', description: 'Cuidado completo dos pés', price: 55, duration_min: 50 },
        ],
      },
      {
        name: 'Fernanda Costa', email: 'fernanda@nahora.com', phone: '(11) 99999-0003',
        specialty: 'Cabeleireira & Colorista', bio: "Especialista em coloração, mechas e tratamentos capilares. Formada pelo L'Oréal Academy.",
        address: 'Rua Pinheiros, 789', city: 'São Paulo', categoryName: 'Cabeleireiro',
        rating_avg: 4.7, rating_count: 189,
        services: [
          { name: 'Corte Feminino', description: 'Corte + escova', price: 80, duration_min: 60 },
          { name: 'Coloração', description: 'Tintura completa', price: 180, duration_min: 120 },
          { name: 'Mechas', description: 'Mechas + hidratação', price: 250, duration_min: 150 },
        ],
      },
      {
        name: 'Ricardo Santos', email: 'ricardo@nahora.com', phone: '(11) 99999-0004',
        specialty: 'Terapeuta Corporal', bio: 'Terapeuta holístico com 10 anos de experiência em massoterapia, shiatsu e reflexologia.',
        address: 'Rua Augusta, 321', city: 'São Paulo', categoryName: 'Massagem',
        rating_avg: 4.9, rating_count: 156,
        services: [
          { name: 'Massagem Relaxante', description: '60 minutos de relaxamento', price: 120, duration_min: 60 },
          { name: 'Shiatsu', description: 'Técnica japonesa', price: 130, duration_min: 50 },
        ],
      },
    ];

    for (const pro of pros) {
      const userResult = await dbRun(
        `INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'entrepreneur')`,
        [pro.name, pro.email, pro.phone, hash]
      );
      const userId = userResult.lastID;

      const cat = await dbGet(`SELECT id FROM categories WHERE name = ?`, [pro.categoryName]);
      if (!cat) continue;

      const proResult = await dbRun(
        `INSERT INTO professionals (user_id, category_id, specialty, bio, address, city, rating_avg, rating_count, is_accepting) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [userId, cat.id, pro.specialty, pro.bio, pro.address, pro.city, pro.rating_avg, pro.rating_count]
      );
      const proId = proResult.lastID;

      for (const svc of pro.services) {
        await dbRun(
          `INSERT INTO services (professional_id, name, description, price, duration_min) VALUES (?, ?, ?, ?, ?)`,
          [proId, svc.name, svc.description, svc.price, svc.duration_min]
        );
      }

      for (let day = 1; day <= 5; day++) {
        await dbRun(
          `INSERT INTO availability_slots (professional_id, day_of_week, start_time, end_time) VALUES (?, ?, '09:00', '18:00')`,
          [proId, day]
        );
      }
      await dbRun(
        `INSERT INTO availability_slots (professional_id, day_of_week, start_time, end_time) VALUES (?, 6, '09:00', '14:00')`,
        [proId]
      );
    }
    console.log('🌱 Profissionais e serviços de demonstração inseridos.');
  }

  console.log('✅ Migrations concluídas com sucesso!');
}

module.exports = { runMigrations };
