import { writable } from "svelte/store";

export let pokerGameMoney = writable(0);
export let userData: any = writable();
