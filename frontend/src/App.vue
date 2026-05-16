<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Side -->
      <div class="login-brand-section">
        <div class="logo-circle">
          <span>YDX</span>
        </div>

        <h1>YathraDepotX</h1>
        <p class="brand-subtitle">
          Smart Public Transport Depot Management and Scheduling System
        </p>

        <div class="feature-list">
          <p>Route Planning</p>
          <p>Bus & Driver Scheduling</p>
          <p>Fuel and Maintenance Logs</p>
          <p>Depot Performance Reports</p>
        </div>
      </div>

      <!-- Right Side -->
      <div class="login-form-section">
        <div class="login-card">
          <h2>Welcome Back</h2>
          <p class="login-text">Login to manage depot operations</p>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Email Address</label>
              <input
                type="email"
                class="form-control"
                v-model="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                v-model="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">User Role</label>
              <select class="form-select" v-model="role" required>
                <option value="">Select role</option>
                <option value="Admin">Admin</option>
                <option value="Depot Manager">Depot Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Driver">Driver</option>
              </select>
            </div>

            <button type="submit" class="btn-login">
              Login
            </button>

            <p v-if="message" class="login-message">
              {{ message }}
            </p>
          </form>
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
      email: "",
      password: "",
      role: "",
      message: "",
    };
  },

  methods: {
    handleLogin() {
      if (this.email && this.password && this.role) {
        this.message = "Login successful. Dashboard will be added next.";
      } else {
        this.message = "Please fill all fields.";
      }
    },
  },
};
</script>