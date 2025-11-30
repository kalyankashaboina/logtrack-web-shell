declare module 'users_app/UsersWidget' {
  import { ComponentType } from 'react'
  const UsersWidget: ComponentType<{ title?: string }>
  export default UsersWidget
}

declare module 'audit_app/AuditWidget' {
  import { ComponentType } from 'react'
  const AnalyticsWidget: ComponentType
  export default AnalyticsWidget
}
