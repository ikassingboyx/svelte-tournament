<script lang="ts">
  import { onMount } from "svelte";
  import { createTournament,changeTournamentRound,getPlayerById, getTournament } from "../functions";
  import { Tournament } from "../static/store";
  import { Link } from "svelte-routing";
  import { TournamentStatus } from "../static/enums";
  let isLoading : boolean = true;
  let isStarted : boolean = false;

  onMount(async () => {
    setTimeout(async ()=>{
      let c: boolean = confirm("czy chesz załadować istniejący turniej?")
      if(c)
      {
        isLoading = true;
        const data = await getTournament()
        if(data)
        {
          isLoading = false;
          isStarted = true;
        }
        else{
          alert("Nie można załadować turnieju")
          isStarted = false;
        }
      }
    })
  });

  const startTournament = async () =>{
    let data = prompt("Podaj nazwę: ")
    if(!data) return;
    isStarted = true;
    isLoading = true;
    await createTournament(data, 10000);
    isLoading = false;
  }
  const handleRoundSubmit = async () =>{
    await changeTournamentRound()
  }

</script>

<Link class="link add-button" to={"/"}>back to main page</Link>
<button class="turnament-button" on:click={startTournament}>start the tournament</button>
{#if isStarted}
  {#if isLoading}
  <p>Loading data...</p>
  {:else}
  {#key $Tournament}
    <h1>{$Tournament.name}</h1>
    <h2>{$Tournament.status}</h2>
    <main class="tournament-view" style="--columns:{$Tournament.rounds.length};">
        {#each $Tournament.rounds as round,i}
          <div class="round-games">
            {#each round as game}
              <div class="tournament-game">
                <h2>{game[0].round}</h2>
                <div class="tournament-game-players">
                  {#each game[0].players as player}

                  {#if player}
                    <div class="member">
                      <span>{player.name} {player.surname}</span>
                      <input type="number" name="score"  min="0"  id="score" disabled={$Tournament.currentRound !== i ||  $Tournament.status == TournamentStatus.Finished} bind:value={player.score}/>
                    </div>
                  {:else}
                    <div class="member">
                        <input type="number" disabled>
                    </div>  
                  {/if}
                    {/each}
                </div>
            </div>
            {/each}
            {#if $Tournament.currentRound == i &&  $Tournament.status !== TournamentStatus.Finished}
                <button on:click={handleRoundSubmit}>submit round {i+1}</button>
            {/if}
          </div>
        {/each}
    </main>
    {#if getPlayerById($Tournament.winner)}
      <h2>winner : {getPlayerById($Tournament.winner)}</h2>
    {/if}
  {/key}
  {/if}
  {:else}
  <h2>nie rozpoczęto</h2>
{/if}

<style>
  .turnament-button{
    width: 120px;
  height: 50px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  background-color: lightgreen;
  color: white;
  }

  .link {
    margin-right: 10px;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid blue;
  font-size: 14px;
  color: blue;
  text-decoration: none;
}

.add-button {
  margin-bottom: 10px;
}

p {
  font-weight: bold;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

h2 {
  font-size: 18px;
  margin-bottom: 5px;
}

.tournament-view {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(var(--columns), 1fr);
  margin: 20px;
}

button {
  width: 120px;
  height: 40px;
  margin: auto;
  cursor: pointer;
}

.round-games {
  display: grid;
  gap: 10px;
}

.tournament-game {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  padding: 20px;
  grid-template-columns: repeat(2, 1fr);
  border: 2px solid black;
}
</style>
