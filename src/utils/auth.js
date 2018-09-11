function reloadAuth() {}
function setAuth({ auth, token }) {
  localStorage.setItem({ auth, token });
}
export default { reloadAuth, setAuth };
