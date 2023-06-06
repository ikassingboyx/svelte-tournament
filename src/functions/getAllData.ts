import { db } from "../static/firebase";
import { QueryDocumentSnapshot, collection, getDocs } from "firebase/firestore";
import type { PlayerType } from "../static/types";
import { Players } from "../static/store";
import { PlayerStatus } from "../static/enums";

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
    
