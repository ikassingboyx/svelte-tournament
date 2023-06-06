import type { PlayerStatus, TournamentStatus } from "./enums"
export type PlayerType = {
    id: string,
    name : string, 
    surname : string, 
    city : string,
    age : number,
    registerDate : number,
    status: PlayerStatus,
    isEditing? : boolean,
    score : number
}

export type PlayerToAddType = {
    name : string, 
    surname : string, 
    city : string,
    age : number,
}

export type TournamentType = {
    name : string,
    status: TournamentStatus,
    numberOfRounds : number,
    numberOfPlayers : number,
    rounds : TournamentPair[][][],
    overallScore : number,
    winPrize :  number,
    players : PlayerType[],
    winner: string,
    currentRound : number,
}

export type TournamentPair = {
    round : number,
    players : PlayerType[]
}


