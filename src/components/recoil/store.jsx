// recoil store
import axios from "axios";
import { atom, selector, selectorFamily } from "recoil";

export const search = atom({
  key: "search",
  default: "",
});

export const poketmonData = atom({
  key: "poketmonData",
  default: [],
});

export const getPoke = selectorFamily({
  key: "getPoke",
  get:
    (url) =>
    async ({ get }) => {
      const res = await axios.get(url);
      const data = await res.data;

      return data;
    },
});
