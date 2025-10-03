import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET /api/pegawai - Get all pegawai
export async function GET() {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM pegawai');
    connection.release();
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching pegawai:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pegawai' }, 
      { status: 500 }
    );
  }
}

// POST /api/pegawai - Create a new pegawai
export async function POST(request) {
  try {
    const body = await request.json();
    const { nm_pegawai, alamat_pegawai, tgl_lahir_pegawai, id_m_status_pegawai } = body;
    
    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO pegawai (nm_pegawai, alamat_pegawai, tgl_lahir_pegawai, id_m_status_pegawai, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [nm_pegawai, alamat_pegawai, tgl_lahir_pegawai, id_m_status_pegawai]
    );
    connection.release();
    
    return NextResponse.json({ 
      id: result.insertId, 
      nm_pegawai, 
      alamat_pegawai, 
      tgl_lahir_pegawai, 
      id_m_status_pegawai 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating pegawai:', error);
    return NextResponse.json(
      { error: 'Failed to create pegawai' }, 
      { status: 500 }
    );
  }
}