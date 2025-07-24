import React, { useState, useEffect } from 'react';
import subAdminService from '../services/subAdminService';
import './AssignTasks.css';

const AssignTasks = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingDesc, setEditingDesc] = useState('');

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await subAdminService.getAssignedEmployees();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await subAdminService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    if (!selectedEmployee || !description) return;
    setLoading(true);
    try {
      await subAdminService.createTask(selectedEmployee, description);
      setDescription('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await subAdminService.deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (taskId, currentDesc) => {
    setEditingTaskId(taskId);
    setEditingDesc(currentDesc);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingDesc('');
  };

  const handleUpdate = async (taskId) => {
    if (!editingDesc) return;
    try {
      await subAdminService.updateTask(taskId, editingDesc);
      cancelEditing();
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="assign-tasks">
      <h2 className="assign-tasks__header">Assign Daily Tasks</h2>

      <div className="assign-tasks__form">
        <div className="assign-tasks__form-group">
          <label htmlFor="employee">Employee</label>
          <select
            id="employee"
            className="assign-tasks__select"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Select an employee</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.user.name} ({emp.designation})
              </option>
            ))}
          </select>
        </div>

        <div className="assign-tasks__form-group">
          <label htmlFor="description">Task Description</label>
          <input
            id="description"
            type="text"
            className="assign-tasks__input"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the task..."
          />
        </div>

        <button
          className="assign-tasks__button"
          onClick={handleCreate}
          disabled={loading || !selectedEmployee || !description}
        >
          {loading ? 'Assigning...' : 'Assign Task'}
        </button>
      </div>

      <ul className="assign-tasks__tasks-list">
        {tasks.length === 0 && (
          <li className="assign-tasks__task-item">
            No tasks for today.
          </li>
        )}
        {tasks.map(task => (
          <li key={task._id} className="assign-tasks__task-item">
            {editingTaskId === task._id ? (
              <>
                <input
                  className="assign-tasks__input"
                  value={editingDesc}
                  onChange={e => setEditingDesc(e.target.value)}
                />
                <div className="assign-tasks__task-actions">
                  <button onClick={() => handleUpdate(task._id)}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <span className="assign-tasks__task-desc">
                  <strong>{task.employee.user.name}:</strong> {task.description}
                </span>
                <div className="assign-tasks__task-actions">
                  <button onClick={() => startEditing(task._id, task.description)}>Edit</button>
                  <button onClick={() => handleDelete(task._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignTasks;
