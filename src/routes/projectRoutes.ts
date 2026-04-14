import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";
import { taskStatusEnum } from "../models/Task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";

const router = Router();

router.use(authenticate);

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
router.param('projectId', projectExists)

router.post("/:projectId/tasks",
    body('name').notEmpty().withMessage('El nombre de la tarea es requerido'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es requerida'),
    handleInputErrors,
    TaskController.createTask
)

router.get("/:projectId/tasks",
    TaskController.getProjectTasks
)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get("/:projectId/tasks/:taskId",
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put("/:projectId/tasks/:taskId",
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('name').notEmpty().withMessage('El nombre de la tarea es requerido'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es requerida'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete("/:projectId/tasks/:taskId",
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post("/:projectId/tasks/:taskId/status",
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio')
        .isIn(Object.values(taskStatusEnum)).withMessage(`Estado inválido. Los estados válidos son: ${Object.values(taskStatusEnum).join(", ")}.`),
    handleInputErrors,
    TaskController.updateStatus
)

/**v Routes for Teams */
router.post("/:projectId/team/find",
    body('email').isEmail().toLowerCase().withMessage('Email no valido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get("/:projectId/team",
    TeamMemberController.getProjectTeam
)

router.post("/:projectId/team",
    body('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete("/:projectId/team",
    body('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

export default router;