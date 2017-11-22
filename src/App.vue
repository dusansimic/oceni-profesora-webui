<template>
  <div id="app">
    <div id="wrapper">
      <b-navbar toggleable="md" type="dark" variant="primary" id="navbar">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand to="/">Oceni profesora</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item to="/profesori/search">Search Profesori</b-nav-item>
            <b-nav-item to="/profesori/add">Add Profesor</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      </br>
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
#wrapper {
  width: 700px;
  margin-left: calc((100% - 700px)/2);
}
#navbar {
  border-radius: 5px;
}
</style>
