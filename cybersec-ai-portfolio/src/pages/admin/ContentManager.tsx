import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Check, Upload } from 'lucide-react';

export function ContentManager() {
  const [content, setContent] = useState<any>({ hero: {}, about: {}, resume: {} });
  const [focusAreasInput, setFocusAreasInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string, section: string} | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data: heroData } = await supabase.from('content').select('*').eq('section', 'hero').single();
    const { data: aboutData } = await supabase.from('content').select('*').eq('section', 'about').single();
    const { data: resumeData } = await supabase.from('content').select('*').eq('section', 'resume').single();
    
    setContent({
      hero: heroData?.data || {},
      about: aboutData?.data || {},
      resume: resumeData?.data || {}
    });

    if (aboutData?.data?.focusAreas) {
      setFocusAreasInput(aboutData.data.focusAreas.join(', '));
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `resume-${Date.now()}.${fileExt}`;
      
      let { error: uploadError } = await supabase.storage.from('resumes').upload(fileName, file);
      
      // If bucket not found, try to create it automatically
      if (uploadError && uploadError.message.toLowerCase().includes('bucket')) {
        const { error: createError } = await supabase.storage.createBucket('resumes', { public: true });
        if (!createError) {
          // Retry upload if bucket creation succeeded
          const { error: retryError } = await supabase.storage.from('resumes').upload(fileName, file);
          uploadError = retryError;
        } else {
          throw new Error('Bucket "resumes" not found. Please create a PUBLIC bucket named "resumes" in your Supabase Storage dashboard.');
        }
      }
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(fileName);
      
      setContent((prev: any) => ({ ...prev, resume: { ...prev.resume, url: publicUrl } }));
      setSaveMessage({ type: 'success', text: 'Resume uploaded! Click "Save Resume" to apply.', section: 'resume' });
      setTimeout(() => setSaveMessage(null), 5000);
    } catch (error: any) {
      console.error('Upload error:', error);
      setSaveMessage({ type: 'error', text: `Upload failed: ${error.message}`, section: 'resume' });
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (section: string) => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      const { data: existing, error: fetchError } = await supabase.from('content').select('id').eq('section', section).single();
      
      let dataToSave = content[section];
      
      if (section === 'about') {
        dataToSave = {
          ...dataToSave,
          focusAreas: focusAreasInput.split(',').map(s => s.trim()).filter(Boolean)
        };
      }

      let saveError;
      if (existing) {
        const { error } = await supabase.from('content').update({ data: dataToSave }).eq('id', existing.id);
        saveError = error;
      } else {
        const { error } = await supabase.from('content').insert([{ section, data: dataToSave }]);
        saveError = error;
      }
      
      if (saveError) throw saveError;
      
      setSaveMessage({ type: 'success', text: 'Successfully saved', section });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage({ type: 'error', text: 'Not saved', section });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!content.hero || !content.about) return <div>Loading...</div>;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2">Hero Section</h2>
          <div className="flex items-center">
            {saveMessage?.section === 'hero' && (
              <span className={`mr-4 text-sm font-medium ${saveMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {saveMessage.text}
              </span>
            )}
            <button
              onClick={() => handleSave('hero')}
              disabled={isSaving}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-medium rounded-lg hover:bg-emerald-400 transition-colors flex items-center disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Hero
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Headline</label>
            <input
              type="text"
              value={content.hero.headline || ''}
              onChange={e => setContent({ ...content, hero: { ...content.hero, headline: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Subheadline</label>
            <input
              type="text"
              value={content.hero.subheadline || ''}
              onChange={e => setContent({ ...content, hero: { ...content.hero, subheadline: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Intro Text</label>
            <textarea
              value={content.hero.intro || ''}
              onChange={e => setContent({ ...content, hero: { ...content.hero, intro: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 h-24"
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2">About Section</h2>
          <div className="flex items-center">
            {saveMessage?.section === 'about' && (
              <span className={`mr-4 text-sm font-medium ${saveMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {saveMessage.text}
              </span>
            )}
            <button
              onClick={() => handleSave('about')}
              disabled={isSaving}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-medium rounded-lg hover:bg-emerald-400 transition-colors flex items-center disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-2" />
              Save About
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Biography</label>
            <textarea
              value={content.about.bio || ''}
              onChange={e => setContent({ ...content, about: { ...content.about, bio: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 h-32"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Career Goals</label>
            <textarea
              value={content.about.careerGoals || ''}
              onChange={e => setContent({ ...content, about: { ...content.about, careerGoals: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 h-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Focus Areas (comma separated)</label>
            <input
              type="text"
              value={focusAreasInput}
              onChange={e => setFocusAreasInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2">Resume</h2>
          <div className="flex items-center">
            {saveMessage?.section === 'resume' && (
              <span className={`mr-4 text-sm font-medium ${saveMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {saveMessage.text}
              </span>
            )}
            <button
              onClick={() => handleSave('resume')}
              disabled={isSaving}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-medium rounded-lg hover:bg-emerald-400 transition-colors flex items-center disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Resume
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Resume URL</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={content.resume?.url || ''}
                onChange={e => setContent({ ...content, resume: { ...content.resume, url: e.target.value } })}
                placeholder="https://... or /resume.pdf"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <button
                  disabled={uploading}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-800 text-emerald-400 border border-emerald-500/30 font-medium rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Upload a file or paste a direct URL to your resume.
            </p>
            
            <div className="mt-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <h4 className="text-sm font-medium text-emerald-400 mb-2">Storage Setup & Security Rules Required</h4>
              <p className="text-xs text-slate-400 mb-2">
                If you see a "Bucket not found" or "Row-level security policy" error, you need to configure your Supabase Storage:
              </p>
              <ol className="list-decimal list-inside text-xs text-slate-400 space-y-2 mb-4">
                <li>Go to your <strong>Supabase Dashboard</strong> &gt; <strong>Storage</strong></li>
                <li>Create a new bucket named exactly: <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">resumes</code> (Make sure <strong>Public bucket</strong> is ON)</li>
                <li>Go to <strong>SQL Editor</strong> in the left sidebar</li>
                <li>Paste and run the following SQL command to allow uploads:</li>
              </ol>
              <div className="bg-slate-950 p-3 rounded border border-slate-800 overflow-x-auto">
                <pre className="text-[10px] text-emerald-400 font-mono">
{`-- Allow public access to read resumes
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');

-- Allow authenticated users to upload resumes
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes');

-- Allow authenticated users to update/delete their resumes
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resumes');
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resumes');`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
