import Project from "../models/Project";
import { Request, Response } from "express";

export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);

        //Asignar el manager
        project.manager = req.user._id;

        try {
            await project.save();
            res.send('Proyecto Creado Correctamente');
        } catch (error) {
            console.log(error);
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    { manager: req.user._id },
                    { team: { $in: [req.user._id] } }
                ]
            });
            res.json(projects);
        } catch (error) {
            console.log(error);
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id).populate('tasks');
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            }

            if (project.manager.toString() !== req.user._id.toString()) {
                const error = new Error('Acción no válida');
                return res.status(403).json({ error: error.message });
            }

            res.json(project);
        } catch (error) {
            console.log(error);
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id);
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            }

            if (project.manager.toString() !== req.user._id.toString()) {
                const error = new Error('Solo el manager puede actualizar un proyecto');
                return res.status(403).json({ error: error.message });
            }
            project.projectName = req.body.projectName
            project.clientName = req.body.clientName
            project.description = req.body.description

            await project.save();
            res.send('Proyecto Actualizado Correctamente');
        } catch (error) {
            console.log(error);
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id);
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            }

            if (project.manager.toString() !== req.user._id.toString()) {
                const error = new Error('Solo el manager puede eliminar un proyecto');
                return res.status(403).json({ error: error.message });
            }

            await project.deleteOne();
            res.send('Proyecto Eliminado Correctamente');
        } catch (error) {
            console.log(error);
        }
    }
}