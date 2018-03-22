<template>
  <div id="app">
    <div id="wrapper">
      <b-navbar toggleable="md" type="dark" variant="primary" id="navbar">
        <b-navbar-brand to="/">Oceni profesora</b-navbar-brand>

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav>
            <b-nav-item to="/" exact>Home</b-nav-item>
            <b-nav-item to="/profesori/search" exact>Search Profesori</b-nav-item>
            <b-nav-item to="/profesori/add" exact>Add Profesor</b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown text="User" right>
              <b-dropdown-item to="/login" exact v-if="!this.$session.has('userData')">Login</b-dropdown-item>
              <b-dropdown-item to="/register" exact v-if="!this.$session.has('userData')">Register</b-dropdown-item>
              <b-dropdown-item @click="logout()" exact v-if="this.$session.has('userData')">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <router-view id="routerView"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    logout () {
      this.$session.remove('userData')
      this.$forceUpdate()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#wrapper {
  width: 700px;
  margin-left: calc((100% - 700px)/2);
}
#navbar {
  margin-top: 10px;
  border-radius: 5px;
}
#routerView {
  margin-top: 10px;
}

@media screen and (max-width: 767px) {
  #app {
    margin-top: 0;
  }
  #wrapper {
    width: 100%;
    margin-left: 0;
  }
  #navbar {
    margin-top: 0;
    border-radius: 0;
  }
}
</style>
