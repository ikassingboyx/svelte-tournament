<script lang="ts">
    import { link,navigate} from "svelte-routing";
    import { addPlayer,getAllData } from "../functions/functions"; 

    let name : string = null
    let surname : string = null
    let age : number = null
    let city : string = null

    const handleSubmitClick = async () =>{
        if(name == null || surname == null || age == null || city == null) return;
        await addPlayer({
            name : name,
            surname : surname, 
            age : age, 
            city : city
        }).then(()=>{
            getAllData()
            navigate("/")
        })
    }
    
</script>


<a class="link add-button" href="/" use:link>back to main page</a>
<td><input type="text" bind:value={name} placeholder="name"></td>
<td><input type="text" bind:value={surname} placeholder="surname"></td>
<td><input type="number" bind:value={age} placeholder="age"></td>
<td><input type="text" bind:value={city} placeholder="city"></td>
<td><button on:click={handleSubmitClick} class="button submit-button">submit</button></td>


<style>
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
    margin-right: 10px;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid blue;
  font-size: 14px;
  color: blue;
  text-decoration: none;
  margin-right: 10px;
}

input {
  width: 100%;
  padding: 4px;
  border: 1px solid lightgray;
  border-radius: 4px;
}

.button {
  width: 80px;
  height: 30px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  font-weight: bold;
}

.submit-button {
  background-color: lightgreen;
  color: white;
}
</style>