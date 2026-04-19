import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Check, Award, ExternalLink, Upload, X, FileText, FileDown } from 'lucide-react';

export function CertificationsManager() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isCreating, setIsCreating] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [docUploadError, setDocUploadError] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    const { data, error } = await supabase.from('certifications').select('*').order('issue_date', { ascending: false });
    if (error) console.error(error);
    else setCertifications(data || []);
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError('Image must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    setImageUploadError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cert-img-${Date.now()}.${fileExt}`;
      const filePath = `certifications/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      setFormData((prev: any) => ({ ...prev, image_url: publicUrl }));
    } catch (error: any) {
      console.error('Image upload error:', error);
      setImageUploadError(`Upload failed: ${error.message || error.statusCode || 'Unknown error'}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDocUpload = async (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png', 'image/jpeg', 'image/jpg', 'image/webp',
    ];
    const allowedExts = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'webp'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      setDocUploadError('Supported formats: PDF, DOC, DOCX, PNG, JPG, WEBP');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setDocUploadError('Document must be less than 10MB');
      return;
    }

    setIsUploadingDoc(true);
    setDocUploadError('');

    try {
      const fileExt = file.name.split('.').pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `cert-doc-${Date.now()}-${sanitizedName}`;
      const filePath = `certifications/docs/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      setFormData((prev: any) => ({ ...prev, document_url: publicUrl, document_name: file.name }));
    } catch (error: any) {
      console.error('Document upload error:', error);
      setDocUploadError(`Upload failed: ${error.message || error.statusCode || 'Unknown error'}`);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleSave = async (id?: string) => {
    setSaveMessage(null);
    const dataToSave = {
      ...formData,
      skills: typeof formData.skills === 'string'
        ? formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : formData.skills
    };

    try {
      let saveError;
      if (id) {
        const { error } = await supabase.from('certifications').update(dataToSave).eq('id', id);
        saveError = error;
      } else {
        const { error } = await supabase.from('certifications').insert([dataToSave]);
        saveError = error;
      }

      if (saveError) throw saveError;

      setIsEditing(null);
      setIsCreating(false);
      setFormData({});
      loadCertifications();

      setSaveMessage({ type: 'success', text: 'Successfully saved' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      console.error('Save error:', error);
      setSaveMessage({ type: 'error', text: `Save failed: ${error.message || error.details || 'Unknown error'}` });
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('certifications').delete().eq('id', id);
      if (error) throw error;
      setDeletingId(null);
      loadCertifications();
    } catch (error) {
      console.error('Delete error:', error);
      setDeletingId(null);
    }
  };

  const startEdit = (cert: any) => {
    setIsEditing(cert.id);
    setImageUploadError('');
    setDocUploadError('');
    setFormData({
      ...cert,
      skills: cert.skills?.join(', ') || ''
    });
  };

  const resetForm = () => {
    setIsEditing(null);
    setIsCreating(false);
    setFormData({});
    setImageUploadError('');
    setDocUploadError('');
  };

  const renderForm = () => (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-1">Certificate / License Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            placeholder="e.g. Certified Ethical Hacker (CEH)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Issuing Organization</label>
          <input
            type="text"
            value={formData.issuing_organization || ''}
            onChange={e => setFormData({...formData, issuing_organization: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            placeholder="e.g. EC-Council"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Credential ID</label>
          <input
            type="text"
            value={formData.credential_id || ''}
            onChange={e => setFormData({...formData, credential_id: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            placeholder="e.g. ECC1234567890"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Issue Date</label>
          <input
            type="text"
            value={formData.issue_date || ''}
            onChange={e => setFormData({...formData, issue_date: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            placeholder="e.g. Jan 2024"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Expiry Date (optional)</label>
          <input
            type="text"
            value={formData.expiry_date || ''}
            onChange={e => setFormData({...formData, expiry_date: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            placeholder="e.g. Jan 2027 or leave empty for no expiration"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Credential URL</label>
          <input
            type="text"
            value={formData.credential_url || ''}
            onChange={e => setFormData({...formData, credential_url: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            placeholder="https://verify.example.com/..."
          />
        </div>

        {/* Image Upload Section */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-1">Badge / Certificate Image</label>

          {formData.image_url && (
            <div className="relative mb-3 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 group">
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-full h-48 object-contain bg-slate-900 p-2"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setFormData({...formData, image_url: ''})}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={isUploadingImage}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {isUploadingImage ? (
                <>
                  <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Image
                </>
              )}
            </button>
            <input
              type="text"
              value={formData.image_url || ''}
              onPaste={(e) => {
                const items = e.clipboardData?.items;
                if (items) {
                  for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                      e.preventDefault();
                      const file = items[i].getAsFile();
                      if (file) handleImageUpload(file);
                      return;
                    }
                  }
                }
              }}
              onChange={e => setFormData({...formData, image_url: e.target.value})}
              placeholder="Or paste an image URL/file..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          {imageUploadError && (
            <p className="text-red-400 text-xs mt-1">{imageUploadError}</p>
          )}
        </div>

        {/* Document Upload Section */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-1">Certificate Document (PDF, DOC, DOCX, or Image)</label>

          {formData.document_url && (
            <div className="flex items-center gap-3 mb-3 p-3 rounded-lg border border-slate-700 bg-slate-900 group">
              <FileText className="w-8 h-8 text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">{formData.document_name || 'Uploaded document'}</p>
                <a
                  href={formData.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400/70 hover:text-emerald-400 transition-colors"
                >
                  View document ↗
                </a>
              </div>
              <button
                type="button"
                onClick={() => setFormData({...formData, document_url: '', document_name: ''})}
                className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                title="Remove document"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleDocUpload(file);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => docInputRef.current?.click()}
              disabled={isUploadingDoc}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {isUploadingDoc ? (
                <>
                  <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Document
                </>
              )}
            </button>
            <input
              type="text"
              value={formData.document_url || ''}
              onChange={e => setFormData({...formData, document_url: e.target.value})}
              placeholder="Or paste a document URL..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          {docUploadError && (
            <p className="text-red-400 text-xs mt-1">{docUploadError}</p>
          )}
          <p className="text-slate-600 text-xs mt-1">Max 10MB · PDF, DOC, DOCX, PNG, JPG, WEBP</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-1">Description (optional)</label>
          <textarea
            value={formData.description || ''}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 h-24"
            placeholder="Brief description of the certification..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-1">Skills (comma separated)</label>
          <input
            type="text"
            value={formData.skills || ''}
            onChange={e => setFormData({...formData, skills: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            placeholder="e.g. Network Security, Penetration Testing, Ethical Hacking"
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
          onClick={resetForm}
          className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSave(isEditing || undefined)}
          className="px-4 py-2 bg-emerald-500 text-slate-950 font-medium rounded-lg hover:bg-emerald-400 transition-colors flex items-center"
        >
          <Check className="w-4 h-4 mr-2" />
          Save Certification
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-100">Certifications & Licenses</h2>
        {!isCreating && !isEditing && (
          <button
            onClick={() => { setIsCreating(true); setFormData({}); setImageUploadError(''); setDocUploadError(''); }}
            className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </button>
        )}
      </div>

      {(isCreating || isEditing) && renderForm()}

      <div className="space-y-4">
        {certifications.map(cert => (
          <div key={cert.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 min-w-0">
              {cert.image_url ? (
                <img src={cert.image_url} alt={cert.name} className="w-12 h-12 rounded-lg object-contain bg-white/5 p-1 shrink-0" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-emerald-400" />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-100 truncate">{cert.name}</h3>
                <p className="text-sm text-emerald-400/80">{cert.issuing_organization} • {cert.issue_date}</p>
                <div className="flex items-center gap-3 mt-1">
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-emerald-400 flex items-center transition-colors">
                      <ExternalLink className="w-3 h-3 mr-1" /> Credential
                    </a>
                  )}
                  {cert.document_url && (
                    <a href={cert.document_url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-500/70 hover:text-cyan-400 flex items-center transition-colors">
                      <FileDown className="w-3 h-3 mr-1" /> Document
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2 shrink-0 ml-4">
              {deletingId === cert.id ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(cert.id)}
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
                    onClick={() => startEdit(cert)}
                    className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(cert.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {certifications.length === 0 && !isCreating && (
          <div className="text-center py-12 text-slate-500">
            <Award className="w-12 h-12 mx-auto mb-3 text-slate-700" />
            <p className="font-mono text-sm">No certifications added yet.</p>
            <p className="text-xs mt-1">Click "Add Certification" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
