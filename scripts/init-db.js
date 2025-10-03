const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pegawai_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function initDatabase() {
  let connection;
  
  try {
    // Create connection without specifying database first
    const tempConfig = { ...dbConfig };
    delete tempConfig.database;
    
    connection = await mysql.createConnection(tempConfig);
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(`Database '${dbConfig.database}' created or already exists`);
    
    // Select the database
    await connection.changeUser({ database: dbConfig.database });
    
    // Create pegawai table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS pegawai (
        id_pegawai INT AUTO_INCREMENT PRIMARY KEY,
        nm_pegawai VARCHAR(60) NOT NULL,
        alamat_pegawai VARCHAR(100) NOT NULL,
        tgl_lahir_pegawai DATE NOT NULL,
        id_m_status_pegawai INT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await connection.query(createTableQuery);
    console.log('Table pegawai created or already exists');
    
    // Insert sample data if table is empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM pegawai');
    if (rows[0].count === 0) {
      const sampleData = [
        ['John Doe', '123 Main St, City', '1990-05-15', 1],
        ['Jane Smith', '456 Oak Ave, Town', '1985-12-03', 2],
        ['Robert Johnson', '789 Pine Rd, Village', '1992-08-22', 1]
      ];
      
      for (const [name, address, birthDate, statusId] of sampleData) {
        await connection.query(
          'INSERT INTO pegawai (nm_pegawai, alamat_pegawai, tgl_lahir_pegawai, id_m_status_pegawai, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
          [name, address, birthDate, statusId]
        );
      }
      
      console.log('Sample data inserted');
    }
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the initialization
initDatabase();