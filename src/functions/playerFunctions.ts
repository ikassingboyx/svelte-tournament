import type { PlayerToAddType, PlayerType } from "../static/types"
import { Players, Tournament } from "../static/store"
import { db } from "../static/firebase"
import { deleteDoc,doc,setDoc,getDoc } from "firebase/firestore"
import { PlayerStatus } from "../static/enums"
import { get } from "svelte/store"
import Player from "../components/Player.svelte"

export const getPlayer = async(id: string) =>{
    const docRef = doc(db, "players", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

export const deletePlayer = async (id: string) => {
    await deleteDoc(doc(db, "players", id)).catch((error)=>{
        console.error("Error adding document: ", error);
    })
}
export const changePlayersEditingStatus = (id: string) => {
    Players.update(players => {
        const player = players.find(player => player.id === id)
        player.isEditing = !player.isEditing
        return players
    })
}

export const updatePlayer = async (id: string,player : PlayerToAddType) => {
    await setDoc(doc(db, "players", id),{
        ...player,
    }).catch((error)=>{
        console.error("Error updating document: ", error);
    })
}


export const addPlayer = async (player : PlayerToAddType) => {
    const id = Date.now().toString()
    await setDoc(doc(db, "players", id),{
        ...player,
        registerDate : id,
        status: PlayerStatus.Player
    }).catch((error)=>{
        console.error("Error adding document: ", error);
    })
}


export const searchPhrase = (phrase : string, field : string) =>{
    let data : PlayerType[] = get(Players)
    if(!phrase) return null; 
    else if(!field)
    {
        let res : PlayerType[] = []
        const fields = ['id','name','surname','age','city']
        for(const f of fields) {
            const temp : PlayerType[] = data.filter((player : PlayerType) => (player[f]).toString().includes(phrase))  
            res = [...res, ...temp]
        }     
        return res;
    }
    else return data.filter(player => player[field].includes(phrase))
}