<script lang="ts">
    import type { PlayerType } from "../static/types";
    import { deletePlayer,changePlayersEditingStatus,getAllData } from "../functions/functions";
    export let player : PlayerType;

    const handleEditClick = () =>{
        changePlayersEditingStatus(player.id)
    }
    const handleDeleteClick = async () =>{
       await deletePlayer(player.id).then(()=>{
        getAllData()
       })
    }

</script>


<tr class="player-card">
    <td>{player.id}</td>
    <td>{player.name}</td>
    <td>{player.surname}</td>
    <td>{player.age}</td>
    <td>{player.city}</td>
    <td><button on:click={handleEditClick} class="button edit-button">edit</button></td>
    <td><button on:click={handleDeleteClick} class="button delete-button ">delete</button></td>
</tr>

<style>
.player-card {
  background-color: #f2f2f2;
}

td {
  padding: 8px;
  border: 1px solid black;
}

.button {
  width: 80px;
  height: 30px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  font-weight: bold;
}

.edit-button {
  background-color: lightblue;
  color: white;
}

.delete-button {
  background-color: red;
  color: white;
}
</style>