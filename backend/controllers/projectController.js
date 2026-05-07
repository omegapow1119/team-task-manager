import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      admin: req.user._id,
      members: [req.user._id] // admin is also a member
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    // Find projects where the user is a member
    const projects = await Project.find({ members: req.user._id }).populate('admin', 'name email');
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check if user is a member
    if (!project.members.some(member => member._id.equals(req.user._id))) {
      res.status(403);
      throw new Error('Not authorized to view this project');
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a member to project
// @route   PUT /api/projects/:id/members
// @access  Private (Admin only)
export const addMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check if user is admin
    if (!project.admin.equals(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized, only admin can add members');
    }

    // Find user to add
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      res.status(404);
      throw new Error('User not found with this email');
    }

    // Check if already a member
    if (project.members.includes(userToAdd._id)) {
      res.status(400);
      throw new Error('User is already a member');
    }

    project.members.push(userToAdd._id);
    await project.save();

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check if user is admin
    if (!project.admin.equals(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized, only admin can delete project');
    }

    await project.deleteOne();

    res.json({ message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};
