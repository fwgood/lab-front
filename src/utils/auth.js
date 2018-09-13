export function reloadrole() {}
export function setAuth({ role, token }) {
  localStorage.setItem('role', role);
  localStorage.setItem('token', token);
}
export function getAuth() {
  return {
    role: localStorage.getItem('role'),
    token: localStorage.getItem('token'),
  };
}
