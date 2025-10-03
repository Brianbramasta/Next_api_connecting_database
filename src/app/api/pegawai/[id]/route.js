import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET /api/pegawai/[id] - Get a single pegawai by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM pegawai WHERE id_pegawai = ?', [id]);
    connection.release();
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Pegawai not found' }, { status: 404 });
    }
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching pegawai:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pegawai' }, 
      { status: 500 }
    );
  }
}

// PUT /api/pegawai/[id] - Update a pegawai by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { nm_pegawai, alamat_pegawai, tgl_lahir_pegawai, id_m_status_pegawai } = body;
    
    const connection = await db.getConnection();
    const [result] = await connection.query(
      'UPDATE pegawai SET nm_pegawai = ?, alamat_pegawai = ?, tgl_lahir_pegawai = ?, id_m_status_pegawai = ?, updated_at = NOW() WHERE id_pegawai = ?',
      [nm_pegawai, alamat_pegawai, tgl_lahir_pegawai, id_m_status_pegawai, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Pegawai not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      id: parseInt(id), 
      nm_pegawai, 
      alamat_pegawai, 
      tgl_lahir_pegawai, 
      id_m_status_pegawai 
    });
  } catch (error) {
    console.error('Error updating pegawai:', error);
    return NextResponse.json(
      { error: 'Failed to update pegawai' }, 
      { status: 500 }
    );
  }
}

// DELETE /api/pegawai/[id] - Delete a pegawai by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const connection = await db.getConnection();
    const [result] = await connection.query('DELETE FROM pegawai WHERE id_pegawai = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Pegawai not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Pegawai deleted successfully' });
  } catch (error) {
    console.error('Error deleting pegawai:', error);
    return NextResponse.json(
      { error: 'Failed to delete pegawai' }, 
      { status: 500 }
    );
  }
}