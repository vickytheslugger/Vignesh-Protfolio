import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';

export function ExperienceManager() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isCreating, setIsCreating] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    const { data, error } = await supabase.from('experience').select('*').order('start_date', { ascending: false });
    if (error) console.error(error);
    else setExperiences(data || []);
  };

  const handleSave = async (id?: string) => {
    setSaveMessage(null);
    const dataToSave = {
      ...formData,
      technologies: typeof formData.technologies === 'string' 
        ? formData.technologies.split(',').map((t: string) => t.trim()).filter(Boolean)
        : formData.technologies
    };

    try {
      let saveError;
      if (id) {
        const { error } = await supabase.from('experience').update(dataToSave).eq('id', id);
        saveError = error;
      } else {
        const { error } = await supabase.from('experience').insert([dataToSave]);
        saveError = error;
      }
      
      if (saveError) throw saveError;

      setIsEditing(null);
      setIsCreating(false);
      setFormData({});
      loadExperiences();
      
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
      const { error } = await supabase.from('experience').delete().eq('id', id);
      if (error) throw error;
      setDeletingId(null);
      loadExperiences();
    } catch (error) {
      console.error('Delete error:', error);
      setDeletingId(null);
    }
  };

  const startEdit = (exp: any) => {
    setIsEditing(exp.id);
    setFormData({
      ...exp,
      technologies: exp.technologies?.join(', ') || ''
    });
  };

  const renderForm = () => (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Organization</label>
          <input
            type="text"
            value={formData.organization || ''}
            onChange={e => setFormData({...formData, organization: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Start Date</label>
          <input
            type="text"
            value={formData.start_date || ''}
            onChange={e => setFormData({...formData, start_date: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            placeholder="e.g. Jan 2023"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">End Date</label>
          <input
            type="text"
            value={formData.end_date || ''}
            onChange={e => setFormData({...formData, end_date: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            placeholder="e.g. Present"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Logo URL</label>
          <input
            type="text"
            value={formData.logo || ''}
            onChange={e => setFormData({...formData, logo: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
          <textarea
            value={formData.description || ''}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 h-24"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-1">Technologies (comma separated)</label>
          <input
            type="text"
            value={formData.technologies || ''}
            onChange={e => setFormData({...formData, technologies: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
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
          Save Experience
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-100">Experience</h2>
        {!isCreating && !isEditing && (
          <button
            onClick={() => { setIsCreating(true); setFormData({}); }}
            className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </button>
        )}
      </div>

      {(isCreating || isEditing) && renderForm()}

      <div className="space-y-4">
        {experiences.map(exp => (
          <div key={exp.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100">{exp.title}</h3>
              <p className="text-sm text-emerald-400/80">{exp.organization} • {exp.start_date} - {exp.end_date || 'Present'}</p>
            </div>
            <div className="flex space-x-2">
              {deletingId === exp.id ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(exp.id)}
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
                    onClick={() => startEdit(exp)}
                    className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(exp.id)}
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
