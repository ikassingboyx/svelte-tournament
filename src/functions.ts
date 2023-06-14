import type { PlayerToAddType, PlayerType, TournamentPair, TournamentType } from "./static/types"
import { Players, Tournament, TournamentPairs } from "./static/store"
import { db } from "./static/firebase"
import { deleteDoc,doc,setDoc,getDoc } from "firebase/firestore"
import { PlayerStatus } from "./static/enums"
import { get } from "svelte/store"
import { TournamentStatus } from "./static/enums";
import {isEqual} from 'lodash/isEqual';
import Player from "./components/Player.svelte"

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
import { QueryDocumentSnapshot, collection, getDocs } from "firebase/firestore";

export const getAllData = async ()=>{
    await getDocs(collection(db,'players')).then((snap)=>{
      const data: PlayerType[] = snap.docs.map((doc: QueryDocumentSnapshot<PlayerType>)=>{
        return {
          id: doc.id,
          name : doc.data().name, 
          surname : doc.data().surname,
          city : doc.data().city,
          age : doc.data().age,
          registerDate : doc.data().registerDate,
          status : (doc.data().status == 1)? PlayerStatus.Bot : PlayerStatus.Player,
          isEditing : false,
          score : 0,
        }
      })
      Players.set(data)
      return data;
    })
}
    


let playersWaitingForFirstGame : PlayerType[] = []
export const createTournament = async (name : string, winPrize : number ) =>{
    await getAllData()
    playersWaitingForFirstGame = get(Players)
    TournamentPairs.set(shuffle(get(Players)))
    const q : number = get(Players).length
    let rounds = []
    let numberOfRounds : number = Math.ceil(Math.log2(q))

    let closestPowerOfTwo : number = Math.pow(2, Math.ceil(Math.log2(q)))
    let playersInFirstRound : number = closestPowerOfTwo - 2*(closestPowerOfTwo-q)

    let iterator = Math.pow(2, Math.ceil(Math.log2(q)-1))
    for(let i=0;i<numberOfRounds;i++) 
    {
        rounds.push([])
        if(i == 0)
        {
            for(let j=0;j<playersInFirstRound/2;j++)
             rounds[i].push([
                {
                    round : i+1,
                    players : [
                        drawAndRemoveFromWaitingPlayers(),
                        drawAndRemoveFromWaitingPlayers(),
                    ],
                    isCurrentRound: true
                }
            ])
        }
        else{
            for(let j=0;j<iterator;j++) rounds[i].push([
                {
                    round : i+1,
                    players : [
                        drawAndRemoveFromWaitingPlayers(),
                        drawAndRemoveFromWaitingPlayers(),
                    ],
                    isCurrentRound : false,
                    
                }
            ])
        }
        iterator = iterator/ 2
    }
    
    Tournament.set({
        name : name,
        status: TournamentStatus.Created,
        numberOfRounds : numberOfRounds,
        numberOfPlayers : q,
        rounds : rounds, 
        overallScore : 0,
        winPrize :  winPrize,
        winner : null,
        players : get(Players),
        currentRound : 0,
    })
    await saveTournament()
    console.log("no zapisałem")
}

const getWinnerFromPair = (players :  PlayerType[]) =>{
    if(players[0].score == players[1].score) return null; // handle draw?
    else if(players[0].score > players[1].score) return players[0]
    else return players[1]
}

export const changeTournamentRound = async () =>{
    const currentRound : number = get(Tournament).currentRound
    Tournament.update(tournament => ({...tournament, status : TournamentStatus.InProgress }));
    if(currentRound == get(Tournament).numberOfRounds-1)
    {
        const winner = getWinnerFromPair(get(Tournament).rounds[get(Tournament).currentRound][0][0].players)
        Tournament.update(tournament => ({...tournament, status : TournamentStatus.Finished, winner : winner.id }));
        await saveTournament()
        return;
    } 
    
    const gamesInCurrentRound  : TournamentPair[][] = get(Tournament).rounds[currentRound]
    let roundWinners : PlayerType[] = []
        gamesInCurrentRound.forEach((matches: TournamentPair[]) => {
        matches.forEach((match: TournamentPair) => {
            const winner = getWinnerFromPair(match.players)
            if(winner == null) Tournament.update(tournament => ({ ...tournament, status : TournamentStatus.IncorrectlyFilled }));
            else roundWinners.push(getWinnerFromPair(match.players))
        });
    });      
    await saveTournament()
    
    if(get(Tournament).status == TournamentStatus.IncorrectlyFilled) return;
    
    let gamesInNextRound : TournamentPair[][] = get(Tournament).rounds[currentRound+1]
    gamesInNextRound.forEach((matches: TournamentPair[]) => {
        matches.forEach((match: TournamentPair) => {
          match.players.forEach((player: PlayerType, index: number) => {
            if (!player) {
              match.players[index] = {...roundWinners.shift(),  score: 0};
            }
          });
        });
      });
      
    let rounds = get(Tournament).rounds
    rounds[currentRound + 1] = [...gamesInNextRound]    
    Tournament.update(tournament => ({ ...tournament, currentRound: tournament.currentRound + 1, rounds }));
    await saveTournament()
}


export const saveTournament = async () =>{
    await setDoc(doc(db, "tournament", "tournament"),{
        ... get(Tournament), rounds: JSON.stringify(get(Tournament).rounds), players : JSON.stringify(get(Players)),
    }).catch((error)=>{
        console.error("Error updating document: ", error);
    })
    await getTournament()
} 
export const getTournament = async () =>{
    const docRef = doc(db, "tournament", "tournament");
    const docSnap = await getDoc(docRef);
    const data = {...docSnap.data(),rounds :JSON.parse(docSnap.data().rounds), players : JSON.parse(docSnap.data().players)}
    if(comparePlayers((data as TournamentType).players, get(Players)))
    {
        Tournament.set(data as TournamentType)
        return true
    }
    else return null;
}
const comparePlayers = (a : PlayerType[],b : PlayerType[]) =>{

    if (a.length !== b.length) {
        return false;
    }
    return a.every((value, index) => {
        console.log("--", value, "--", b[index])
        return JSON.stringify(value) === JSON.stringify(b[index]
    )});
}


const drawAndRemoveFromWaitingPlayers = () : PlayerType =>{
    let player : PlayerType = playersWaitingForFirstGame[Math.floor(Math.random() * playersWaitingForFirstGame.length)]
    playersWaitingForFirstGame = playersWaitingForFirstGame.filter(p => p.id !== player.id)
    return player
}


const shuffle = (arr: PlayerType[]) : PlayerType[] =>{
    const shuffled = arr.slice();
    const n = shuffled.length;
    const swap = (array: PlayerType[], i: number, j: number) => {
        let tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    for (let i = 0; i < n; i++) 
        swap(shuffled, i, Math.floor(Math.random() * n));
    return shuffled;
}

export const getPlayerById = (id : string) : string =>{
    const player = get(Players).find(p => p.id === id)
    return (player)?`${player.name} ${player.surname}` : ""
}
