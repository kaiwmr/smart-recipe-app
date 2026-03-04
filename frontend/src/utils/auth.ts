export const logout = () => {
    localStorage.removeItem("BiteWiseToken");
    window.location.href = "/login"; 
};

export const getToken = () => localStorage.getItem("BiteWiseToken");
