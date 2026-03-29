import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Mail } from 'lucide-react';

export function MessagesManager() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    else setMessages(data || []);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
      setDeletingId(null);
      loadMessages();
    } catch (error) {
      console.error('Delete error:', error);
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-100">Messages</h2>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-slate-400 text-center py-8">No messages found.</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-100 truncate">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-sm text-emerald-400 hover:underline truncate block">
                      {msg.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end space-x-4">
                  <span className="text-xs text-slate-500">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                  {deletingId === msg.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDelete(msg.id)}
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
                    <button
                      onClick={() => setDeletingId(msg.id)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-slate-300 whitespace-pre-wrap bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                {msg.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
