import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await createTask(taskData);
      setTasks([response.data, ...tasks]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await updateTask(taskId, taskData);
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter(task => task._id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                  {tasks.length} tasks
                </span>
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading tasks...</p>
                </div>
              ) : (
                <TaskList
                  tasks={tasks}
                  onEdit={setEditingTask}
                  onDelete={handleDeleteTask}
                />
              )}
            </div>
          </div>

          <div>
            <div className="bg-white shadow rounded-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <TaskForm
                onSubmit={(taskData) => {
                  if (editingTask) {
                    handleUpdateTask(editingTask._id, taskData);
                  } else {
                    handleCreateTask(taskData);
                  }
                }}
                initialData={editingTask || {}}
              />
              {editingTask && (
                <button
                  onClick={() => setEditingTask(null)}
                  className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;