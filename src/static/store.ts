import type { PlayerType, TournamentType } from "../static/types";
import { writable, type Writable } from "svelte/store";
export const Players : Writable<PlayerType[]> = writable([])
export const TournamentPairs = writable([])
export const Tournament : Writable<TournamentType> = writable({ rounds : []} as TournamentType)