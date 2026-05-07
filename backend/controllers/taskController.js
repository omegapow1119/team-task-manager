import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (Admin only)
export const createTask = async (req, res, next) => {
  try {
    const { title, description, project: projectId, assignedTo, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Only project admin can create tasks
    if (!project.admin.equals(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized, only admin can create tasks');
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo: assignedTo || null,
      dueDate
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard tasks (assigned to user across all projects)
// @route   GET /api/tasks/dashboard
// @access  Private
export const getDashboardTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'title');
    
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
export const getProjectTasks = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Must be a member to view tasks
    if (!project.members.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to view tasks for this project');
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email');
      
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const project = await Project.findById(task.project);

    const isAdmin = project.admin.equals(req.user._id);
    const isAssignedUser = task.assignedTo && task.assignedTo.equals(req.user._id);

    if (!isAdmin && !isAssignedUser) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    // If user is just assigned (not admin), they can only update status
    if (!isAdmin && isAssignedUser) {
      if (req.body.status) {
        task.status = req.body.status;
        await task.save();
        return res.json(task);
      } else {
        res.status(400);
        throw new Error('Members can only update task status');
      }
    }

    // Admin can update anything
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const project = await Project.findById(task.project);

    // Only admin can delete tasks
    if (!project.admin.equals(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized, only admin can delete tasks');
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};
