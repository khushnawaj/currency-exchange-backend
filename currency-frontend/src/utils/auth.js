export const saveTokens = (access, refresh) => {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
};

export const saveUser = (user) => {
  localStorage.setItem("full_name", user.full_name);
  localStorage.setItem("email", user.email);
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};
