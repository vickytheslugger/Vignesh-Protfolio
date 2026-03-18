import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isCreating, setIsCreating] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('order', { ascending: true });
    if (error) console.error('[ProjectsManager] Load error:', error.message);
    else setProjects(data || []);
  };

  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL (http/https)';
    }
    
    if (formData.github_url && !isValidUrl(formData.github_url)) {
      newErrors.github_url = 'Please enter a valid GitHub URL';
    }
    
    if (formData.live_url && !isValidUrl(formData.live_url)) {
      newErrors.live_url = 'Please enter a valid live demo URL';
    }

    if (!formData.technologies || (typeof formData.technologies === 'string' && !formData.technologies.trim())) {
      newErrors.technologies = 'At least one technology is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (id?: string) => {
    if (!validateForm()) {
      setSaveMessage({ type: 'error', text: 'Please fix the errors below' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }
    
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
        const { error } = await supabase.from('projects').update(dataToSave).eq('id', id);
        saveError = error;
      } else {
        const maxOrder = projects.length > 0 ? Math.max(...projects.map(p => p.order || 0)) : 0;
        const { error } = await supabase.from('projects').insert([{ ...dataToSave, order: maxOrder + 1 }]);
        saveError = error;
      }
      
      if (saveError) throw saveError;

      setIsEditing(null);
      setIsCreating(false);
      setFormData({});
      setErrors({});
      loadProjects();
      
      setSaveMessage({ type: 'success', text: 'Project saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('[ProjectsManager] Save error:', error instanceof Error ? error.message : 'Unknown error');
      setSaveMessage({ type: 'error', text: 'Failed to save project' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setDeletingId(null);
      loadProjects();
    } catch (error) {
      console.error('[ProjectsManager] Delete error:', error instanceof Error ? error.message : 'Unknown error');
      setDeletingId(null);
    }
  };

  const startEdit = (project: any) => {
    setIsEditing(project.id);
    setErrors({});
    setFormData({
      ...project,
      technologies: project.technologies?.join(', ') || ''
    });
  };

  const ErrorMessage = ({ message }: { message?: string }) => (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center text-red-400 text-xs mt-1 space-x-1"
        >
          <AlertCircle className="w-3 h-3" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderForm = () => (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-6 mb-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-200 border-b border-slate-700 pb-2">Basic Details</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={e => {
                setFormData({...formData, title: e.target.value});
                if (errors.title) setErrors({...errors, title: ''});
              }}
              className={`w-full bg-slate-900 border ${errors.title ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors`}
              placeholder="E-commerce Platform"
            />
            <ErrorMessage message={errors.title} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              value={formData.description || ''}
              onChange={e => {
                setFormData({...formData, description: e.target.value});
                if (errors.description) setErrors({...errors, description: ''});
              }}
              className={`w-full bg-slate-900 border ${errors.description ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 h-24 transition-colors`}
              placeholder="A brief overview of the project..."
            />
            <ErrorMessage message={errors.description} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-200 border-b border-slate-700 pb-2">Media & Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-1">Image URL</label>
            <input
              type="text"
              value={formData.image || ''}
              onChange={e => {
                setFormData({...formData, image: e.target.value});
                if (errors.image) setErrors({...errors, image: ''});
              }}
              placeholder="https://images.unsplash.com/..."
              className={`w-full bg-slate-900 border ${errors.image ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors`}
            />
            <ErrorMessage message={errors.image} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">GitHub URL</label>
            <input
              type="text"
              value={formData.github_url || ''}
              onChange={e => {
                setFormData({...formData, github_url: e.target.value});
                if (errors.github_url) setErrors({...errors, github_url: ''});
              }}
              placeholder="https://github.com/username/repo"
              className={`w-full bg-slate-900 border ${errors.github_url ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors`}
            />
            <ErrorMessage message={errors.github_url} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Live URL</label>
            <input
              type="text"
              value={formData.live_url || ''}
              onChange={e => {
                setFormData({...formData, live_url: e.target.value});
                if (errors.live_url) setErrors({...errors, live_url: ''});
              }}
              placeholder="https://project-demo.com"
              className={`w-full bg-slate-900 border ${errors.live_url ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors`}
            />
            <ErrorMessage message={errors.live_url} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-200 border-b border-slate-700 pb-2">Tech Stack</h3>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Technologies (comma separated) <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.technologies || ''}
            onChange={e => {
              setFormData({...formData, technologies: e.target.value});
              if (errors.technologies) setErrors({...errors, technologies: ''});
            }}
            placeholder="React, TypeScript, Tailwind CSS..."
            className={`w-full bg-slate-900 border ${errors.technologies ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors`}
          />
          <ErrorMessage message={errors.technologies} />
        </div>
      </div>

      <div className="flex justify-end items-center space-x-3 mt-6 pt-4 border-t border-slate-700">
        <AnimatePresence>
          {saveMessage && (
            <motion.span 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm font-medium ${saveMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {saveMessage.text}
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={() => { setIsEditing(null); setIsCreating(false); setFormData({}); setErrors({}); }}
          className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSave(isEditing || undefined)}
          className="px-4 py-2 bg-emerald-500 text-slate-950 font-medium rounded-lg hover:bg-emerald-400 transition-colors flex items-center shadow-lg shadow-emerald-500/20"
        >
          <Check className="w-4 h-4 mr-2" />
          Save Project
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-100">Projects</h2>
        {!isCreating && !isEditing && (
          <button
            onClick={() => { setIsCreating(true); setFormData({}); setErrors({}); }}
            className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </button>
        )}
      </div>

      {(isCreating || isEditing) && renderForm()}

      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between group hover:border-slate-600 transition-colors">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-100 truncate">{project.title}</h3>
              <p className="text-sm text-slate-400 truncate max-w-xl">{project.description}</p>
            </div>
            <div className="flex space-x-2 ml-4">
              {deletingId === project.id ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(project.id)}
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
                    onClick={() => startEdit(project)}
                    className="p-2 text-slate-400 hover:text-emerald-400 transition-colors bg-slate-900 rounded-lg border border-slate-700"
                    title="Edit Project"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(project.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors bg-slate-900 rounded-lg border border-slate-700"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && !isCreating && (
          <div className="text-center py-12 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-500">No projects found. Add your first project to showcase your work!</p>
          </div>
        )}
      </div>
    </div>
  );
}
