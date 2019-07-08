import * as CounterTypes from "../types/Counter";
const state = {
  main: 0
}

const mutations = {
  [CounterTypes.DECREMENT_MAIN_COUNTER] (state) {
    state.main--
  },
  [CounterTypes.INCREMENT_MAIN_COUNTER] (state) {
    state.main++
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit(CounterTypes.DECREMENT_MAIN_COUNTER)
  }
}

export default {
  state,
  mutations,
  actions
}
