import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { RootState } from '../../store';
import { authService } from '../../services/auth';

type Role = 'client' | 'technician' | 'master_technician' | 'admin';

interface Props {
  allowedRole?: Role;
  allowedRoles?: Role[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<Props> = ({
  allowedRole,
  allowedRoles,
  children,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const roles = allowedRoles ?? (allowedRole ? [allowedRole] : []);

  React.useEffect(() => {
    if (user && roles.length > 0 && !roles.includes(user.role as Role)) {
      if (__DEV__) {
        console.warn('[RoleGuard] role mismatch; signing out');
      }
      void authService.logout().then(() => dispatch(logout()));
    }
  }, [user, roles, dispatch]);

  if (!user || (roles.length > 0 && !roles.includes(user.role as Role))) {
    return null;
  }

  return <>{children}</>;
};
