import {create} from "zustand";

const useNotification = create((set)=>({
    notification:[],
    setNotification:(notification)=>set({notification}),

}));
export default useNotification;