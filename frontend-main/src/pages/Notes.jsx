import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Trash2, StickyNote, Send, Plus } from 'lucide-react';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const load = async () => {
        try {
            const res = await API.get('/notes');
            setNotes(res.data);
        } catch (err) {
            console.error('Failed to load notes');
        }
    };

    useEffect(() => { load(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            await API.post('/notes', { content });
            setContent('');
            load();
        } catch (err) {
            alert('Failed to save note');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this note?')) return;
        try {
            await API.delete(`/notes/${id}`);
            load();
        } catch (err) {
            alert('Failed to delete note');
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Notes</h1>
                <p className="text-gray-500">Capture your ideas and thoughts</p>
            </div>

            <form onSubmit={handleAdd} className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <textarea
                    className="w-full p-4 text-gray-800 outline-none resize-none h-32 placeholder:text-gray-400 rounded-lg border-2 border-gray-100 focus:border-indigo-500 transition"
                    placeholder="Write your note here..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                />
                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                        <Plus size={18} /> Add Note
                    </button>
                </div>
            </form>

            {notes.length === 0 ? (
                <div className="text-center py-16">
                    <StickyNote className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-500 text-lg">No notes yet. Create your first one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((n) => (
                        <div
                            key={n._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <StickyNote className="text-indigo-400" size={24} />
                                <button
                                    onClick={() => handleDelete(n._id)}
                                    className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                {n.content}
                            </p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-400">
                                    {new Date(n.createdAt || Date.now()).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notes;