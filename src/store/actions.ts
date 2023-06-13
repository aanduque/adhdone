import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getCurrentUser } from 'vuefire';
import sampleData from '@/exampleState'
export default {
  addTodo({ commit }, text) {
    commit('addTodo', {
      text,
      done: false
    })
  },
  fetchRemoteState({ commit }) {

    getCurrentUser().then((user) => {

      const userDoc = doc(db, "users", user.uid);

      getDoc(userDoc).then((state) => {
        // const data = state.data()
        const data = sampleData
        commit('setInitialState', data)
      });

    })
  },
}