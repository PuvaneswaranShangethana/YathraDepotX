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
            <h2>{{ routes.length }}</h2>
            <span>Active route plans</span>
          </div>

          <div class="stat-card">
            <p>Total Vehicles</p>
            <h2>{{ vehicles.length }}</h2>
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
            <h2>{{ availableVehicleCount }}</h2>
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

      <!-- Route Management Page -->
      <div v-else-if="activePage === 'Routes'" class="page-panel">
        <div class="page-title-row">
          <div>
            <h2>Route Management</h2>
            <p>Create, view, and manage public transport routes.</p>
          </div>

          <span class="page-badge">Routes Module</span>
        </div>

        <div class="form-panel">
          <h3>Add New Route</h3>

          <form @submit.prevent="saveRoute">
            <div class="form-grid">
              <div>
                <label class="form-label">Route Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="routeForm.routeName"
                  placeholder="Example: Colombo - Kandy"
                />
              </div>

              <div>
                <label class="form-label">Start Location</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="routeForm.startLocation"
                  placeholder="Enter start point"
                />
              </div>

              <div>
                <label class="form-label">End Location</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="routeForm.endLocation"
                  placeholder="Enter end point"
                />
              </div>

              <div>
                <label class="form-label">Total Distance</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="routeForm.distance"
                  placeholder="Example: 115 km"
                />
              </div>

              <div>
                <label class="form-label">Estimated Time</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="routeForm.estimatedTime"
                  placeholder="Example: 3h 30m"
                />
              </div>

              <div>
                <label class="form-label">Service Type</label>
                <select class="form-select" v-model="routeForm.serviceType">
                  <option value="">Select service type</option>
                  <option value="Normal">Normal</option>
                  <option value="Express">Express</option>
                  <option value="Semi Luxury">Semi Luxury</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label class="form-label">Status</label>
                <select class="form-select" v-model="routeForm.status">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary-custom">
                Save Route
              </button>

              <button type="button" class="btn-secondary-custom" @click="clearRouteForm">
                Clear
              </button>
            </div>
          </form>
        </div>

        <div class="table-panel">
          <h3>Route List</h3>

          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Route Name</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Distance</th>
                  <th>Time</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="route in routes" :key="route.id">
                  <td>{{ route.id }}</td>
                  <td>{{ route.routeName }}</td>
                  <td>{{ route.startLocation }}</td>
                  <td>{{ route.endLocation }}</td>
                  <td>{{ route.distance }}</td>
                  <td>{{ route.estimatedTime }}</td>
                  <td>{{ route.serviceType }}</td>
                  <td>
                    <span
                      class="status-badge"
                      :class="route.status === 'Active' ? 'active-status' : 'inactive-status'"
                    >
                      {{ route.status }}
                    </span>
                  </td>
                  <td>
                    <button class="btn-delete" @click="deleteRoute(route.id)">
                      Delete
                    </button>
                  </td>
                </tr>

                <tr v-if="routes.length === 0">
                  <td colspan="9" class="empty-text">
                    No routes available.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Vehicle Management Page -->
      <div v-else-if="activePage === 'Vehicles'" class="page-panel">
        <div class="page-title-row">
          <div>
            <h2>Vehicle Management</h2>
            <p>Add, view, and manage bus details used for depot operations.</p>
          </div>

          <span class="page-badge">Vehicles Module</span>
        </div>

        <div class="form-panel">
          <h3>Add New Vehicle</h3>

          <form @submit.prevent="saveVehicle">
            <div class="form-grid">
              <div>
                <label class="form-label">Registration Number</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="vehicleForm.registrationNumber"
                  placeholder="Example: NB-4521"
                />
              </div>

              <div>
                <label class="form-label">Vehicle Type</label>
                <select class="form-select" v-model="vehicleForm.vehicleType">
                  <option value="">Select vehicle type</option>
                  <option value="Bus">Bus</option>
                  <option value="Mini Bus">Mini Bus</option>
                  <option value="Luxury Bus">Luxury Bus</option>
                </select>
              </div>

              <div>
                <label class="form-label">Seating Capacity</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="vehicleForm.seatingCapacity"
                  placeholder="Example: 54"
                />
              </div>

              <div>
                <label class="form-label">Mileage</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="vehicleForm.mileage"
                  placeholder="Example: 125000 km"
                />
              </div>

              <div>
                <label class="form-label">Fuel Type</label>
                <select class="form-select" v-model="vehicleForm.fuelType">
                  <option value="">Select fuel type</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label class="form-label">Availability Status</label>
                <select class="form-select" v-model="vehicleForm.availabilityStatus">
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              <div>
                <label class="form-label">Maintenance Status</label>
                <select class="form-select" v-model="vehicleForm.maintenanceStatus">
                  <option value="Good">Good</option>
                  <option value="Service Due">Service Due</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary-custom">
                Save Vehicle
              </button>

              <button type="button" class="btn-secondary-custom" @click="clearVehicleForm">
                Clear
              </button>
            </div>
          </form>
        </div>

        <div class="table-panel">
          <h3>Vehicle List</h3>

          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Registration No</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Mileage</th>
                  <th>Fuel</th>
                  <th>Availability</th>
                  <th>Maintenance</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="vehicle in vehicles" :key="vehicle.id">
                  <td>{{ vehicle.id }}</td>
                  <td>{{ vehicle.registrationNumber }}</td>
                  <td>{{ vehicle.vehicleType }}</td>
                  <td>{{ vehicle.seatingCapacity }}</td>
                  <td>{{ vehicle.mileage }}</td>
                  <td>{{ vehicle.fuelType }}</td>
                  <td>
                    <span
                      class="status-badge"
                      :class="{
                        'active-status': vehicle.availabilityStatus === 'Available',
                        'warning-status': vehicle.availabilityStatus === 'Assigned',
                        'inactive-status': vehicle.availabilityStatus === 'Unavailable'
                      }"
                    >
                      {{ vehicle.availabilityStatus }}
                    </span>
                  </td>
                  <td>
                    <span
                      class="status-badge"
                      :class="{
                        'active-status': vehicle.maintenanceStatus === 'Good',
                        'warning-status': vehicle.maintenanceStatus === 'Service Due',
                        'maintenance-status': vehicle.maintenanceStatus === 'Under Maintenance'
                      }"
                    >
                      {{ vehicle.maintenanceStatus }}
                    </span>
                  </td>
                  <td>
                    <button class="btn-delete" @click="deleteVehicle(vehicle.id)">
                      Delete
                    </button>
                  </td>
                </tr>

                <tr v-if="vehicles.length === 0">
                  <td colspan="9" class="empty-text">
                    No vehicles available.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Other Placeholder Pages -->
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

      routeForm: {
        routeName: "",
        startLocation: "",
        endLocation: "",
        distance: "",
        estimatedTime: "",
        serviceType: "",
        status: "Active",
      },

      routes: [
        {
          id: 1,
          routeName: "Colombo - Kandy",
          startLocation: "Colombo",
          endLocation: "Kandy",
          distance: "115 km",
          estimatedTime: "3h 30m",
          serviceType: "Express",
          status: "Active",
        },
        {
          id: 2,
          routeName: "Colombo - Galle",
          startLocation: "Colombo",
          endLocation: "Galle",
          distance: "125 km",
          estimatedTime: "2h 45m",
          serviceType: "Normal",
          status: "Active",
        },
      ],

      vehicleForm: {
        registrationNumber: "",
        vehicleType: "",
        seatingCapacity: "",
        mileage: "",
        fuelType: "",
        availabilityStatus: "Available",
        maintenanceStatus: "Good",
      },

      vehicles: [
        {
          id: 1,
          registrationNumber: "NB-4521",
          vehicleType: "Bus",
          seatingCapacity: "54",
          mileage: "125000 km",
          fuelType: "Diesel",
          availabilityStatus: "Available",
          maintenanceStatus: "Good",
        },
        {
          id: 2,
          registrationNumber: "ND-7896",
          vehicleType: "Bus",
          seatingCapacity: "48",
          mileage: "98000 km",
          fuelType: "Diesel",
          availabilityStatus: "Assigned",
          maintenanceStatus: "Good",
        },
      ],

      message: "",
      messageType: "",
    };
  },

  computed: {
    availableVehicleCount() {
      return this.vehicles.filter(
        (vehicle) => vehicle.availabilityStatus === "Available"
      ).length;
    },

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

    saveRoute() {
      if (
        !this.routeForm.routeName ||
        !this.routeForm.startLocation ||
        !this.routeForm.endLocation ||
        !this.routeForm.distance ||
        !this.routeForm.estimatedTime ||
        !this.routeForm.serviceType
      ) {
        alert("Please fill all route fields.");
        return;
      }

      const newRoute = {
        id: this.routes.length + 1,
        routeName: this.routeForm.routeName,
        startLocation: this.routeForm.startLocation,
        endLocation: this.routeForm.endLocation,
        distance: this.routeForm.distance,
        estimatedTime: this.routeForm.estimatedTime,
        serviceType: this.routeForm.serviceType,
        status: this.routeForm.status,
      };

      this.routes.push(newRoute);
      this.clearRouteForm();
      alert("Route added successfully.");
    },

    deleteRoute(id) {
      const confirmDelete = confirm("Are you sure you want to delete this route?");

      if (confirmDelete) {
        this.routes = this.routes.filter((route) => route.id !== id);
      }
    },

    clearRouteForm() {
      this.routeForm = {
        routeName: "",
        startLocation: "",
        endLocation: "",
        distance: "",
        estimatedTime: "",
        serviceType: "",
        status: "Active",
      };
    },

    saveVehicle() {
      if (
        !this.vehicleForm.registrationNumber ||
        !this.vehicleForm.vehicleType ||
        !this.vehicleForm.seatingCapacity ||
        !this.vehicleForm.mileage ||
        !this.vehicleForm.fuelType
      ) {
        alert("Please fill all vehicle fields.");
        return;
      }

      const newVehicle = {
        id: this.vehicles.length + 1,
        registrationNumber: this.vehicleForm.registrationNumber,
        vehicleType: this.vehicleForm.vehicleType,
        seatingCapacity: this.vehicleForm.seatingCapacity,
        mileage: this.vehicleForm.mileage,
        fuelType: this.vehicleForm.fuelType,
        availabilityStatus: this.vehicleForm.availabilityStatus,
        maintenanceStatus: this.vehicleForm.maintenanceStatus,
      };

      this.vehicles.push(newVehicle);
      this.clearVehicleForm();
      alert("Vehicle added successfully.");
    },

    deleteVehicle(id) {
      const confirmDelete = confirm("Are you sure you want to delete this vehicle?");

      if (confirmDelete) {
        this.vehicles = this.vehicles.filter((vehicle) => vehicle.id !== id);
      }
    },

    clearVehicleForm() {
      this.vehicleForm = {
        registrationNumber: "",
        vehicleType: "",
        seatingCapacity: "",
        mileage: "",
        fuelType: "",
        availabilityStatus: "Available",
        maintenanceStatus: "Good",
      };
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