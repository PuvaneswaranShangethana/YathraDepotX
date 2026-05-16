<template>
  <!-- LOGIN / REGISTER PAGE -->
  <div v-if="!isLoggedIn" class="auth-page">
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

            <div class="demo-box">
              <strong>Admin Demo Login</strong>
              <p>Email: admin@yathradepotx.lk</p>
              <p>Password: admin123</p>
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

  <!-- DASHBOARD PAGE -->
  <div v-else class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div>
        <div class="sidebar-logo">
          <img src="/yathradepotx-logo.png" alt="YathraDepotX Logo" />
        </div>

        <h3>YathraDepotX</h3>
        <p class="role-text">{{ currentUser.role }}</p>

        <nav class="menu">
          <button
            v-for="item in visibleMenuItems"
            :key="item"
            class="menu-item"
            :class="{ active: activePage === item }"
            @click="activePage = item"
          >
            {{ item }}
          </button>
        </nav>
      </div>

      <button class="logout-btn" @click="logout">
        Logout
      </button>
    </aside>

    <!-- Main Content -->
    <main class="dashboard-main">
      <header class="dashboard-header">
        <div>
          <h1>{{ dashboardTitle }}</h1>
          <p>
            Welcome, {{ currentUser.name }}. {{ dashboardDescription }}
          </p>
        </div>

        <div class="user-badge">
          {{ currentUser.role }}
        </div>
      </header>

      <!-- Dashboard Content -->
      <div v-if="activePage === 'Dashboard'">
        <!-- Admin Cards -->
        <section class="stats-grid" v-if="currentUser.role === 'Admin'">
          <div class="stat-card">
            <p>Total Users</p>
            <h2>24</h2>
            <span>Registered system users</span>
          </div>

          <div class="stat-card">
            <p>Total Routes</p>
            <h2>18</h2>
            <span>Active route plans</span>
          </div>

          <div class="stat-card">
            <p>Total Vehicles</p>
            <h2>42</h2>
            <span>Registered buses</span>
          </div>

          <div class="stat-card">
            <p>Total Drivers</p>
            <h2>36</h2>
            <span>Registered drivers</span>
          </div>
        </section>

        <!-- Depot Manager Cards -->
        <section class="stats-grid" v-if="currentUser.role === 'Depot Manager'">
          <div class="stat-card">
            <p>Today’s Trips</p>
            <h2>56</h2>
            <span>Scheduled services</span>
          </div>

          <div class="stat-card">
            <p>Completed Trips</p>
            <h2>38</h2>
            <span>Successfully completed</span>
          </div>

          <div class="stat-card">
            <p>Delayed Trips</p>
            <h2>7</h2>
            <span>Require attention</span>
          </div>

          <div class="stat-card">
            <p>Vehicle Usage</p>
            <h2>82%</h2>
            <span>Fleet utilisation rate</span>
          </div>
        </section>

        <!-- Supervisor Cards -->
        <section class="stats-grid" v-if="currentUser.role === 'Supervisor'">
          <div class="stat-card">
            <p>Available Vehicles</p>
            <h2>29</h2>
            <span>Ready for assignment</span>
          </div>

          <div class="stat-card">
            <p>Available Drivers</p>
            <h2>31</h2>
            <span>Ready for duty</span>
          </div>

          <div class="stat-card">
            <p>Pending Schedules</p>
            <h2>12</h2>
            <span>Need confirmation</span>
          </div>

          <div class="stat-card">
            <p>Route Conflicts</p>
            <h2>2</h2>
            <span>Need correction</span>
          </div>
        </section>

        <!-- Driver Cards -->
        <section class="stats-grid" v-if="currentUser.role === 'Driver'">
          <div class="stat-card">
            <p>Today’s Route</p>
            <h2>R-07</h2>
            <span>Colombo to Kandy</span>
          </div>

          <div class="stat-card">
            <p>Departure</p>
            <h2>08:30</h2>
            <span>Morning schedule</span>
          </div>

          <div class="stat-card">
            <p>Assigned Bus</p>
            <h2>ND-4521</h2>
            <span>Vehicle number</span>
          </div>

          <div class="stat-card">
            <p>Trip Status</p>
            <h2>On-time</h2>
            <span>Current status</span>
          </div>
        </section>

        <!-- Status and Alerts -->
        <section class="dashboard-content">
          <div class="panel">
            <h3>Today’s Trip Status</h3>

            <div class="status-row">
              <span class="status-dot success"></span>
              <p>On-time Trips</p>
              <strong>38</strong>
            </div>

            <div class="status-row">
              <span class="status-dot warning"></span>
              <p>Delayed Trips</p>
              <strong>7</strong>
            </div>

            <div class="status-row">
              <span class="status-dot info"></span>
              <p>Completed Trips</p>
              <strong>11</strong>
            </div>

            <div class="status-row">
              <span class="status-dot danger"></span>
              <p>Cancelled Trips</p>
              <strong>0</strong>
            </div>
          </div>

          <div class="panel">
            <h3>Depot Alerts</h3>

            <div class="alert-card warning-alert">
              3 buses require maintenance check this week.
            </div>

            <div class="alert-card success-alert">
              Route schedules updated successfully.
            </div>

            <div class="alert-card info-alert">
              Fuel usage report is ready for review.
            </div>
          </div>
        </section>
      </div>

      <!-- Placeholder Pages -->
      <div v-else class="page-panel">
        <h2>{{ activePage }}</h2>
        <p>
          This page will be developed in the next step. It belongs to the
          {{ currentUser.role }} role.
        </p>

        <div class="module-note">
          <strong>Next development:</strong>
          Add form, table, edit, delete, and database connection for this module.
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      activeForm: "login",
      isLoggedIn: false,
      activePage: "Dashboard",

      currentUser: {
        name: "",
        role: "",
      },

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

  computed: {
    dashboardTitle() {
      if (this.currentUser.role === "Admin") {
        return "Admin Dashboard";
      }

      if (this.currentUser.role === "Depot Manager") {
        return "Depot Manager Dashboard";
      }

      if (this.currentUser.role === "Supervisor") {
        return "Supervisor Dashboard";
      }

      if (this.currentUser.role === "Driver") {
        return "Driver Dashboard";
      }

      return "Depot Dashboard";
    },

    dashboardDescription() {
      if (this.currentUser.role === "Admin") {
        return "Manage users, routes, vehicles, drivers, schedules, and reports.";
      }

      if (this.currentUser.role === "Depot Manager") {
        return "Monitor depot operations, trip progress, vehicle usage, and reports.";
      }

      if (this.currentUser.role === "Supervisor") {
        return "Manage daily schedules, assign buses and drivers, and update trip status.";
      }

      if (this.currentUser.role === "Driver") {
        return "View assigned routes, schedules, and trip details.";
      }

      return "Monitor depot operations from one place.";
    },

    visibleMenuItems() {
      if (this.currentUser.role === "Admin") {
        return [
          "Dashboard",
          "Users",
          "Routes",
          "Vehicles",
          "Drivers",
          "Schedules",
          "Fuel Logs",
          "Maintenance",
          "Reports"
        ];
      }

      if (this.currentUser.role === "Depot Manager") {
        return [
          "Dashboard",
          "Routes",
          "Vehicles",
          "Drivers",
          "Schedules",
          "Fuel Logs",
          "Maintenance",
          "Reports"
        ];
      }

      if (this.currentUser.role === "Supervisor") {
        return [
          "Dashboard",
          "Routes",
          "Vehicles",
          "Drivers",
          "Schedules",
          "Trip Status"
        ];
      }

      if (this.currentUser.role === "Driver") {
        return [
          "Dashboard",
          "My Schedule",
          "My Route",
          "Trip Status"
        ];
      }

      return ["Dashboard"];
    }
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
      }, 1200);
    },

    handleLogin() {
      const adminEmail = "admin@yathradepotx.lk";
      const adminPassword = "admin123";

      if (
        this.login.email === adminEmail &&
        this.login.password === adminPassword &&
        this.login.role === "Admin"
      ) {
        this.currentUser = {
          name: "System Admin",
          role: "Admin",
        };

        this.isLoggedIn = true;
        this.activePage = "Dashboard";
        this.message = "";
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
        this.currentUser = {
          name: user.fullName,
          role: user.role,
        };

        this.isLoggedIn = true;
        this.activePage = "Dashboard";
        this.message = "";
      } else {
        this.message = "User not found. Please register before login.";
        this.messageType = "message-error";
      }
    },

    logout() {
      this.isLoggedIn = false;
      this.currentUser = {
        name: "",
        role: "",
      };

      this.login = {
        email: "",
        password: "",
        role: "",
      };

      this.activeForm = "login";
      this.activePage = "Dashboard";
      this.message = "";
    },
  },
};
</script>