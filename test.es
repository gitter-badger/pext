import 'regenerator/runtime'
import vows from 'vows'
import assert from 'assert'
import {delay} from '.'

export default vows.describe('pext')

.addBatch({

  "1 sec delay": {

    async topic() {
      const t = Date.now()
      await delay(1000)
      return t
    },

    "should take 1 sec": t => {
      assert.epsilon(10, t, Date.now() - 1000)
    },

  },

})
