import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus, Plus, Trash2 } from 'lucide-react';
import api from '../utils/api';
import useAuthStore from '../store/useAuthStore';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms State
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      toast.error('Failed to load project details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/projects/${id}/members`, { email: newMemberEmail });
      setProject(data);
      setShowMemberForm(false);
      setNewMemberEmail('');
      toast.success('Member added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/tasks', {
        ...newTask,
        project: id,
        assignedTo: newTask.assignedTo || null
      });
      setTasks([...tasks, data]);
      setShowTaskForm(false);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      toast.success('Task created successfully');
      fetchProjectData(); // Refresh to get populated user details
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? data : t));
      toast.success('Task updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  if (loading) return <div>Loading project...</div>;
  if (!project) return <div>Project not found</div>;

  const isAdmin = project.admin._id === user._id;

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
        <p className="mt-2 text-gray-600">{project.description}</p>
        
        <div className="mt-6 flex justify-between items-center border-t border-gray-200 pt-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Team Members</h3>
            <div className="mt-2 flex items-center space-x-2">
              {project.members.map(member => (
                <div key={member._id} className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs font-bold" title={member.name}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowMemberForm(!showMemberForm)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </button>
          )}
        </div>

        {/* Add Member Form */}
        {showMemberForm && isAdmin && (
          <form onSubmit={handleAddMember} className="mt-4 flex items-end space-x-4 bg-gray-50 p-4 rounded-md">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">User Email</label>
              <input
                type="email"
                required
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="email@example.com"
              />
            </div>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Add
            </button>
          </form>
        )}
      </div>

      {/* Tasks Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Project Tasks</h2>
          {isAdmin && (
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </button>
          )}
        </div>

        {/* Create Task Form */}
        {showTaskForm && isAdmin && (
          <form onSubmit={handleCreateTask} className="mb-6 bg-gray-50 p-4 rounded-md space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assign To</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">Unassigned</option>
                  {project.members.map(member => (
                    <option key={member._id} value={member._id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowTaskForm(false)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Task
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map(task => {
            const isAssignedToMe = task.assignedTo?._id === user._id;
            const canUpdateStatus = isAdmin || isAssignedToMe;

            return (
              <div key={task._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:shadow-sm transition-shadow">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Assignee: {task.assignedTo ? task.assignedTo.name : 'Unassigned'}</span>
                    <span>Status: {task.status.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="ml-4 flex items-center space-x-4">
                  {canUpdateStatus && (
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="DONE">DONE</option>
                    </select>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {tasks.length === 0 && !showTaskForm && (
            <p className="text-gray-500 text-center py-4">No tasks in this project yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
