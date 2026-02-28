export const saveTokens = (access, refresh) => {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
};

export const saveUser = (user) => {
  localStorage.setItem("full_name", user.full_name);
  localStorage.setItem("email", user.email);
  localStorage.setItem("isStaff", user.is_staff ? "true" : "false");
  localStorage.setItem("isSuperuser", user.is_superuser ? "true" : "false");
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

export const isAdmin = () => {
  return localStorage.getItem("isStaff") === "true";
};
