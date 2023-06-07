<script lang="ts">
    import { Router,Route } from "svelte-routing";
    import PlayersView from "./components/View.svelte";
    import TournamentHallView from "./components/TourViewTwo.svelte";
    import AddPlayerView from "./components/Add.svelte";
    import { onMount } from "svelte";
    import "./static/styles/style.scss"
    onMount(()=>{
      const correct_routes = ["/","/tournament","/add"]
      if(!correct_routes.includes(window.location.pathname)) window.location.replace('/')
    })
</script>
<Router>
      <Route exact path={"/"}><PlayersView /></Route>  
      <Route exact path={"/tournament"}><TournamentHallView /></Route>  
      <Route exact path={"/add"}><AddPlayerView /></Route>  
</Router>