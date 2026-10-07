import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.invite': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.get_tasks': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.get_activities': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.get_members': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update_member_role': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'userId': ParamValue} }
    'projects.kick_member': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'userId': ParamValue} }
    'ai.handle_command': { paramsTuple?: []; params?: {} }
    'tasks.store': { paramsTuple?: []; params?: {} }
    'tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.store_subtask': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'tasks.update_subtask': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.destroy_subtask': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'comments.index': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'comments.store': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'notifications.index': { paramsTuple?: []; params?: {} }
    'notifications.respond': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.get_profile': { paramsTuple?: []; params?: {} }
    'profile.update_profile': { paramsTuple?: []; params?: {} }
    'profile.update_password': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.invite': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'ai.handle_command': { paramsTuple?: []; params?: {} }
    'tasks.store': { paramsTuple?: []; params?: {} }
    'tasks.store_subtask': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'comments.store': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'notifications.respond': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.get_tasks': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.get_activities': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.get_members': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'comments.index': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'notifications.index': { paramsTuple?: []; params?: {} }
    'profile.get_profile': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.get_tasks': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.get_activities': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.get_members': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'comments.index': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'notifications.index': { paramsTuple?: []; params?: {} }
    'profile.get_profile': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update_member_role': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'userId': ParamValue} }
    'tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.update_subtask': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.update_profile': { paramsTuple?: []; params?: {} }
    'profile.update_password': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.kick_member': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'userId': ParamValue} }
    'tasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.destroy_subtask': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}