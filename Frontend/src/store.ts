import { writable } from "svelte/store";

export let pokerGameMoney = writable(0);
export let isPlayingValue = writable(false);
export let userData: any = writable();
