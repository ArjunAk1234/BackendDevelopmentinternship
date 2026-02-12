import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Plus, Trash2, CheckCircle2, Circle, PlayCircle, Edit2, X, Check } from 'lucide-react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const load = async () => {
        try {
            const res = await API.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error('Failed to load tasks');
        }
    };

    useEffect(() => { load(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            await API.post('/tasks', {
                title,
                description: description || undefined,
                status: 'pending'
            });
            setTitle('');
            setDescription('');
            load();
        } catch (err) {
            alert('Failed to add task');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, updates) => {
        try {
            await API.put(`/tasks/${id}`, updates);
            load();
        } catch (err) {
            alert('Failed to update task');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        await handleUpdate(id, { status: newStatus });
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this task?')) return;
        try {
            await API.delete(`/tasks/${id}`);
            load();
        } catch (err) {
            alert('Failed to delete task');
        }
    };

    const handleEdit = (task) => {
        setEditingTask({
            id: task._id,
            title: task.title,
            description: task.description || ''
        });
    };

    const handleSaveEdit = async () => {
        if (!editingTask.title.trim()) return;

        try {
            await API.put(`/tasks/${editingTask.id}`, {
                title: editingTask.title,
                description: editingTask.description || undefined
            });
            setEditingTask(null);
            load();
        } catch (err) {
            alert('Failed to update task');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="text-green-500" size={22} />;
            case 'in-progress':
                return <PlayCircle className="text-blue-500" size={22} />;
            default:
                return <Circle className="text-gray-400" size={22} />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Tasks</h1>
                <p className="text-gray-500">Manage your to-do list</p>
            </div>

            <form onSubmit={handleAdd} className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <input
                    className="w-full px-4 py-3 mb-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                    placeholder="Task title..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                <textarea
                    className="w-full px-4 py-3 mb-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition resize-none"
                    placeholder="Description (optional)..."
                    rows="2"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                    <Plus size={20} /> Add Task
                </button>
            </form>

            {tasks.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Circle className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-500 text-lg">No tasks yet. Add one to get started!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tasks.map(task => (
                        <div
                            key={task._id}
                            className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition"
                        >
                            {editingTask?.id === task._id ? (
                                <div className="space-y-3">
                                    <input
                                        className="w-full px-3 py-2 border-2 border-indigo-500 rounded-lg focus:outline-none"
                                        value={editingTask.title}
                                        onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                                    />
                                    <textarea
                                        className="w-full px-3 py-2 border-2 border-indigo-500 rounded-lg focus:outline-none resize-none"
                                        rows="2"
                                        placeholder="Description (optional)..."
                                        value={editingTask.description}
                                        onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                                        >
                                            <Check size={18} /> Save
                                        </button>
                                        <button
                                            onClick={() => setEditingTask(null)}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
                                        >
                                            <X size={18} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-start gap-3 flex-1">
                                            {getStatusIcon(task.status)}
                                            <div className="flex-1">
                                                <h3 className="text-gray-800 font-semibold text-lg">{task.title}</h3>
                                                {task.description && (
                                                    <p className="text-gray-600 mt-1">{task.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(task)}
                                                className="text-gray-400 hover:text-indigo-500 transition"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task._id)}
                                                className="text-gray-400 hover:text-red-500 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => handleStatusChange(task._id, 'pending')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${task.status === 'pending'
                                                    ? 'bg-gray-200 text-gray-700'
                                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                                }`}
                                        >
                                            Pending
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(task._id, 'in-progress')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${task.status === 'in-progress'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                                }`}
                                        >
                                            In Progress
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(task._id, 'completed')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${task.status === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                                }`}
                                        >
                                            Completed
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tasks;