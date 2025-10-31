import { Response } from 'express';
import { AppMessages } from '../../utils/messages.enum';
import { prisma } from '../../../prisma/prisma';
import { AuthRequest } from '../../types/auth.types';
import { createIssueSchema, updateIssueSchema } from '../../schemas/issue.schema';

export const createIssue = async (req: AuthRequest, res: Response) => {
  try {
    const result = createIssueSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: user not found' });
    }

    const { title, description, priority } = result.data;

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        priority,
        userId: Number(req.user.id),
      },
    });

    res.status(201).json({ message: AppMessages.ISSUE_CREATED, issue, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error creating issue', error });
  }
};

// export const getAllIssues = async (req: AuthRequest, res: Response) => {
//   try {
//     const issues = await prisma.issue.findMany({ include: { user: true } });
//     res.status(200).json(issues);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching issues', error });
//   }
// };


export const getAllIssues = async (req: AuthRequest, res: Response) => {
  try {
    const { role, status, priority } = req.query;

    const where: any = {};

    if (status && typeof status === "string") {
      where.status = status.toUpperCase();
    }

    if (priority && typeof priority === "string") {
      where.priority = priority.toUpperCase();
    }

    if (role && typeof role === "string") {
      where.user = { role: role.toLowerCase() };
    }

    const issues = await prisma.issue.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching issues", error });
  }
};

export const getIssueById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const issue = await prisma.issue.findUnique({ where: { id: Number(id) } });

    if (!issue) {
      return res.status(404).json({ message: AppMessages.ISSUE_NOT_FOUND });
    }
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: user role not found' });
    }

    // allow user if owns the issue, or admin/super-admin
    // if (
    //     req.user.role === "user" &&
    //     issue.userId !== Number(req.user.id)
    // ) {
    //     return res.status(403).json({ message: "Forbidden: not your issue" });
    // }

    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching issue', error });
  }
};

export const updateIssue = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = updateIssueSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const issue = await prisma.issue.findUnique({ where: { id: Number(id) } });
    if (!issue) return res.status(404).json({ message: AppMessages.ISSUE_NOT_FOUND });
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: user role not found' });
    }

    // check permission
    if (req.user.role === 'user' && issue.userId !== Number(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden: not your issue' });
    }

    const updated = await prisma.issue.update({
      where: { id: Number(id) },
      data: result.data,
    });

    res.status(200).json({ message: AppMessages.ISSUE_UPDATED, issue: updated, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error updating issue', error });
  }
};

export const deleteIssue = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const issue = await prisma.issue.findUnique({ where: { id: Number(id) } });

    if (!issue) return res.status(404).json({ message: AppMessages.ISSUE_NOT_FOUND });
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: user role not found' });
    }

    // super-admin can delete anything
    // admin or user can delete only their own issues
    if (
      (req.user.role === 'user') &&
      issue.userId !== Number(req.user.id)
    ) {
      return res.status(403).json({ message: 'Forbidden: not your issue' });
    }

    await prisma.issue.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: AppMessages.ISSUE_DELETED, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting issue', error });
  }
};
