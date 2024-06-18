import Cookies from "js-cookie";
// services/authService.js
class AuthService {
  isAuthenticated() {
    // Check if the user is authenticated (e.g., by checking the presence of a token)
    // You can use localStorage, sessionStorage, or cookies to store authentication information
    const token = Cookies.get('token');
    return !!token;
  }
}

export default new AuthService();
