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
    if (error) console.error(error);
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
      console.error('Save error:', error);
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
      console.error('Delete error:', error);
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
          <select
            value={formData.category || ''}
            onChange={e => setFormData({...formData, category: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="">Select Category</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Programming">Programming</option>
            <option value="Tools">Tools</option>
            <option value="Skills">Skills</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end items-center space-x-3 mt-4">
        {saveMessage && (
          <span className={`text-sm font-medium ${saveMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
            {saveMessage.text}
          </span>
        )}
        <button
          onClick={() => { setIsEditing(null); setIsCreating(false); setFormData({}); }}
          className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSave(isEditing || undefined)}
          className="px-4 py-2 bg-emerald-500 text-slate-950 font-medium rounded-lg hover:bg-emerald-400 transition-colors flex items-center"
        >
          <Check className="w-4 h-4 mr-2" />
          Save Skill & Tool
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-100">Skills & Tools</h2>
        {!isCreating && !isEditing && (
          <button
            onClick={() => { setIsCreating(true); setFormData({ category: 'Programming' }); }}
            className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill & Tool
          </button>
        )}
      </div>

      {(isCreating || isEditing) && renderForm()}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(skill => (
          <div key={skill.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100">{skill.name}</h3>
              <p className="text-sm text-emerald-400/80">{skill.category}</p>
            </div>
            <div className="flex space-x-2">
              {deletingId === skill.id ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(skill)}
                    className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(skill.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
