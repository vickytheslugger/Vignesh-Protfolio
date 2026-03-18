import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';

export function SkillsManager() {
  const [skills, setSkills] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isCreating, setIsCreating] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const { data, error } = await supabase.from('skills').select('*').order('name', { ascending: true });
    if (error) console.error('[SkillsManager] Load error:', error.message);
    else setSkills(data || []);
  };

  const handleSave = async (id?: string) => {
    setSaveMessage(null);
    try {
      let saveError;
      if (id) {
        const { error } = await supabase.from('skills').update(formData).eq('id', id);
        saveError = error;
      } else {
        const { error } = await supabase.from('skills').insert([formData]);
        saveError = error;
      }
      
      if (saveError) throw saveError;

      setIsEditing(null);
      setIsCreating(false);
      setFormData({});
      loadSkills();
      
      setSaveMessage({ type: 'success', text: 'Successfully saved' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('[SkillsManager] Save error:', error instanceof Error ? error.message : 'Unknown error');
      setSaveMessage({ type: 'error', text: 'Not saved' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      setDeletingId(null);
      loadSkills();
    } catch (error) {
      console.error('[SkillsManager] Delete error:', error instanceof Error ? error.message : 'Unknown error');
      setDeletingId(null);
    }
  };

  const startEdit = (skill: any) => {
    setIsEditing(skill.id);
    setFormData(skill);
  };

  const renderForm = () => (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
