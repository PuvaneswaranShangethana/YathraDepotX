<template>
  <div class="auth-page">
    <div class="auth-container">

      <!-- Left Brand Section -->
      <div class="brand-section">
        <div class="logo-box">
          <img src="/yathradepotx-logo.png" alt="YathraDepotX Logo" />
        </div>

        <h1>YathraDepotX</h1>
        <p class="brand-subtitle">
          Smart Public Transport Depot Management and Scheduling System
        </p>

        <div class="feature-list">
          <div class="feature-item">
            <span></span>
            <p>Route Planning</p>
          </div>

          <div class="feature-item">
            <span></span>
            <p>Bus & Driver Scheduling</p>
          </div>

          <div class="feature-item">
            <span></span>
            <p>Fuel and Maintenance Logs</p>
          </div>

          <div class="feature-item">
            <span></span>
            <p>Depot Performance Reports</p>
          </div>
        </div>
      </div>

      <!-- Right Auth Section -->
      <div class="form-section">
        <div class="auth-card">

          <div class="mobile-logo">
            <img src="/yathradepotx-logo.png" alt="YathraDepotX Logo" />
          </div>

          <!-- Login Form -->
          <div v-if="activeForm === 'login'">
            <h2>Welcome Back</h2>
            <p class="auth-text">Login to manage depot operations</p>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label">Email Address</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="login.email"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="login.password"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">User Role</label>
                <select class="form-select" v-model="login.role" required>
                  <option value="">Select role</option>
                  <option value="Admin">Admin</option>
                  <option value="Depot Manager">Depot Manager</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Driver">Driver</option>
                </select>
              </div>

              <button type="submit" class="btn-auth">
                Login
              </button>

              <p v-if="message" :class="messageType">
                {{ message }}
              </p>
            </form>

            <div class="switch-box">
              <p>Not an admin?</p>
              <button @click="showRegister">
                Register as depot user
              </button>
            </div>
          </div>

          <!-- Register Form -->
          <div v-if="activeForm === 'register'">
            <h2>Create Account</h2>
            <p class="auth-text">Register before logging in as a depot user</p>

            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="register.fullName"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Email Address</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="register.email"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Phone Number</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="register.phone"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">User Role</label>
                <select class="form-select" v-model="register.role" required>
                  <option value="">Select role</option>
                  <option value="Depot Manager">Depot Manager</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Driver">Driver</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="register.password"
                  placeholder="Create password"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="register.confirmPassword"
                  placeholder="Confirm password"
                  required
                />
              </div>

              <button type="submit" class="btn-auth">
                Register
              </button>

              <p v-if="message" :class="messageType">
                {{ message }}
              </p>
            </form>

            <div class="switch-box">
              <p>Already registered?</p>
              <button @click="showLogin">
                Back to login
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      activeForm: "login",

      login: {
        email: "",
        password: "",
        role: "",
      },

      register: {
        fullName: "",
        email: "",
        phone: "",
        role: "",
        password: "",
        confirmPassword: "",
      },

      registeredUsers: [],

      message: "",
      messageType: "",
    };
  },

  methods: {
    showRegister() {
      this.activeForm = "register";
      this.message = "";
    },

    showLogin() {
      this.activeForm = "login";
      this.message = "";
    },

    handleRegister() {
      if (this.register.password !== this.register.confirmPassword) {
        this.message = "Passwords do not match.";
        this.messageType = "message-error";
        return;
      }

      if (this.register.role === "Admin") {
        this.message = "Admin registration is not allowed.";
        this.messageType = "message-error";
        return;
      }

      const existingUser = this.registeredUsers.find(
        (user) => user.email === this.register.email
      );

      if (existingUser) {
        this.message = "This email is already registered.";
        this.messageType = "message-error";
        return;
      }

      this.registeredUsers.push({
        fullName: this.register.fullName,
        email: this.register.email,
        phone: this.register.phone,
        role: this.register.role,
        password: this.register.password,
      });

      this.message = "Registration successful. Please login now.";
      this.messageType = "message-success";

      this.register = {
        fullName: "",
        email: "",
        phone: "",
        role: "",
        password: "",
        confirmPassword: "",
      };

      setTimeout(() => {
        this.activeForm = "login";
        this.message = "";
      }, 1500);
    },

    handleLogin() {
      const adminEmail = "admin@yathradepotx.lk";
      const adminPassword = "admin123";

      if (
        this.login.email === adminEmail &&
        this.login.password === adminPassword &&
        this.login.role === "Admin"
      ) {
        this.message = "Admin login successful. Dashboard will be added next.";
        this.messageType = "message-success";
        return;
      }

      if (this.login.role === "Admin") {
        this.message = "Invalid admin login details.";
        this.messageType = "message-error";
        return;
      }

      const user = this.registeredUsers.find(
        (user) =>
          user.email === this.login.email &&
          user.password === this.login.password &&
          user.role === this.login.role
      );

      if (user) {
        this.message = `${user.role} login successful. Dashboard will be added next.`;
        this.messageType = "message-success";
      } else {
        this.message = "User not found. Please register before login.";
        this.messageType = "message-error";
      }
    },
  },
};
</script>