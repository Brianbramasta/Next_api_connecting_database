'use client';

import { useState, useEffect } from 'react';

export default function PegawaiPage() {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    nm_pegawai: '',
    alamat_pegawai: '',
    tgl_lahir_pegawai: '',
    id_m_status_pegawai: ''
  });
  const [editingId, setEditingId] = useState(null);
  
  // Fetch all pegawai
  const fetchPegawai = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pegawai');
      if (!response.ok) throw new Error('Failed to fetch pegawai');
      const data = await response.json();
      setPegawaiList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/pegawai/${editingId}` : '/api/pegawai';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error(editingId ? 'Failed to update pegawai' : 'Failed to create pegawai');
      
      // Reset form
      setFormData({
        nm_pegawai: '',
        alamat_pegawai: '',
        tgl_lahir_pegawai: '',
        id_m_status_pegawai: ''
      });
      setEditingId(null);
      
      // Refresh the list
      fetchPegawai();
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Handle edit
  const handleEdit = (pegawai) => {
    setFormData({
      nm_pegawai: pegawai.nm_pegawai,
      alamat_pegawai: pegawai.alamat_pegawai,
      tgl_lahir_pegawai: pegawai.tgl_lahir_pegawai,
      id_m_status_pegawai: pegawai.id_m_status_pegawai
    });
    setEditingId(pegawai.id_pegawai);
  };
  
  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this pegawai?')) return;
    
    try {
      const response = await fetch(`/api/pegawai/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete pegawai');
      
      // Refresh the list
      fetchPegawai();
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Load pegawai on component mount
  useEffect(() => {
    fetchPegawai();
  }, []);
  
  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Pegawai Management</h1>
      
      {/* Form Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Pegawai' : 'Add New Pegawai'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nm_pegawai" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pegawai
            </label>
            <input
              type="text"
              id="nm_pegawai"
              name="nm_pegawai"
              value={formData.nm_pegawai}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="alamat_pegawai" className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <input
              type="text"
              id="alamat_pegawai"
              name="alamat_pegawai"
              value={formData.alamat_pegawai}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="tgl_lahir_pegawai" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Lahir
            </label>
            <input
              type="date"
              id="tgl_lahir_pegawai"
              name="tgl_lahir_pegawai"
              value={formData.tgl_lahir_pegawai}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="id_m_status_pegawai" className="block text-sm font-medium text-gray-700 mb-1">
              Status ID
            </label>
            <input
              type="number"
              id="id_m_status_pegawai"
              name="id_m_status_pegawai"
              value={formData.id_m_status_pegawai}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="md:col-span-2 flex justify-end space-x-3">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    nm_pegawai: '',
                    alamat_pegawai: '',
                    tgl_lahir_pegawai: '',
                    id_m_status_pegawai: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingId ? 'Update Pegawai' : 'Add Pegawai'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 pb-0">Pegawai List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Lahir
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated At
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pegawaiList.map((pegawai) => (
                <tr key={pegawai.id_pegawai}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pegawai.id_pegawai}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pegawai.nm_pegawai}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {pegawai.alamat_pegawai}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pegawai.tgl_lahir_pegawai}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pegawai.id_m_status_pegawai}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(pegawai.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(pegawai.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(pegawai)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pegawai.id_pegawai)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {pegawaiList.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No pegawai found. Add a new pegawai to get started.
          </div>
        )}
      </div>
    </div>
  );
}