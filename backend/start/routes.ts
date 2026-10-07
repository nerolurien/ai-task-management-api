import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { authThrottle, aiThrottle } from '#start/limiter'

const AuthController = () => import('#controllers/auth_controller')
const ProjectsController = () => import('#controllers/projects_controller')
const TasksController = () => import('#controllers/tasks_controller')
const AiController = () => import('#controllers/ai_controller')

// Autentikasi
router.post('/register', [AuthController, 'register']).use(authThrottle)
router.post('/login', [AuthController, 'login']).use(authThrottle)

router
  .group(() => {
    router.post('/invite', [AuthController, 'invite'])
    
    // Fitur Role User & Admin
    router.get('/projects', [ProjectsController, 'index'])
    router.get('/projects/:id/tasks', [ProjectsController, 'getTasks'])
    router.get('/projects/:id/activities', [ProjectsController, 'getActivities'])
    router.get('/projects/:id/members', [ProjectsController, 'getMembers'])
    router.delete('/projects/:id/members/:userId', [ProjectsController, 'kickMember'])
    router.post('/projects', [ProjectsController, 'store'])
    router.post('/ai/command', [AiController, 'handleCommand']).use(aiThrottle)

    // Manual Task CRUD & Comments
    router.post('/tasks', [TasksController, 'store'])
    router.put('/tasks/:id', [TasksController, 'update'])
    router.delete('/tasks/:id', [TasksController, 'destroy'])
    router.post('/tasks/:taskId/subtasks', [TasksController, 'storeSubtask'])
    router.put('/subtasks/:id', [TasksController, 'updateSubtask'])
    router.delete('/subtasks/:id', [TasksController, 'destroySubtask'])

    const CommentsController = () => import('#controllers/comments_controller')
    router.get('/tasks/:taskId/comments', [CommentsController, 'index'])
    router.post('/tasks/:taskId/comments', [CommentsController, 'store'])

    // Notifications
    const NotificationsController = () => import('#controllers/notifications_controller')
    router.get('/notifications', [NotificationsController, 'index'])
    router.post('/notifications/:id/respond', [NotificationsController, 'respond'])

    // Profile
    const ProfileController = () => import('#controllers/profile_controller')
    router.get('/profile', [ProfileController, 'getProfile'])
    router.put('/profile', [ProfileController, 'updateProfile'])
    router.put('/profile/password', [ProfileController, 'updatePassword'])

    // Fitur Khusus Role Admin
    const UsersController = () => import('#controllers/users_controller')
    router
      .group(() => {
        router.get('/users', [UsersController, 'index'])
        router.delete('/users/:id', [UsersController, 'destroy'])
        router.get('/projects/:id', [ProjectsController, 'show'])
        router.put('/projects/:id', [ProjectsController, 'update'])
        router.delete('/projects/:id', [ProjectsController, 'destroy'])
      })
      .use(middleware.admin())
  })
  .use(middleware.auth())