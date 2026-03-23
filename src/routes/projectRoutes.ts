import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";

const router = Router();

router.post("/",
    body('projectName').notEmpty().withMessage('El nombre del proyecto es requerido'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es requerido'),
    body('description').notEmpty().withMessage('La descripción es requerida'),
    handleInputErrors,
    ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);

router.get("/:id",
    param('id').isMongoId().withMessage('El ID del proyecto no es válido'),
    handleInputErrors,
    ProjectController.getProjectById
);

router.put("/:id",
    param('id').isMongoId().withMessage('El ID del proyecto no es válido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es requerido'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es requerido'),
    body('description').notEmpty().withMessage('La descripción es requerida'),
    handleInputErrors,
    ProjectController.updateProject
);

router.delete("/:id",
    param('id').isMongoId().withMessage('El ID del proyecto no es válido'),
    handleInputErrors,
    ProjectController.deleteProject
);

/** Routes for tasks */
router.post("/:projectId/tasks",
    validateProjectExists,
    body('name').notEmpty().withMessage('El nombre de la tarea es requerido'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es requerida'),
    handleInputErrors,
    TaskController.createTask
)

export default router;