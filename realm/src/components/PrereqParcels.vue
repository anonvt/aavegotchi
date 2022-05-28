<template>
  <slot v-if="fetchStatus.loaded"></slot>
  <div v-else>
    <div v-if="fetchStatus.error">
      Error loading parcels
    </div>
    <div v-else>
      <DataFetcher
        subject="parcels"
        :use="useParcels"
        fetchProperty="initParcels"
        resultProperty="parcelsById"
      >
        <template #loaded>
          Parcels fetched
        </template>
      </DataFetcher>
      <DataFetcher
        subject="channelings"
        :use="useChannelings"
        fetchProperty="initChannelings"
        resultProperty="channelings"
      >
        <template #loaded>
          Channelings fetched
        </template>
      </DataFetcher>

      <div style="margin: 20px 0;">
        The Realm maps on this site work best on fast computers - if loading parcels takes a long time, it probably won't work very well on your current device, sorry! You can try using a desktop or laptop instead.
      </div>

      <div
        v-if="!fetchStatus.loading"
        style="margin: 20px 0; font-size: 1.4em; font-weight: bold; text-align: center;"
      >
        Click the 'Fetch' button above to start.
      </div>
    </div>
  </div>
</template>
<script>
import useCapabilities from '@/data/useCapabilities'
import useParcels from '@/data/useParcels'
import useChannelings from '@/data/useChannelings'
import DataFetcher from './DataFetcher.vue'

export default {
  components: {
    DataFetcher
  },
  setup (props) {
    const { initParcels, fetchStatus } = useParcels()
    const { initChannelings } = useChannelings()
    const { isNetworkSlow, isDeviceSlow } = useCapabilities()
    if (!isNetworkSlow.value && !isDeviceSlow.value) {
      initParcels()
      initChannelings()
    }
    return { fetchStatus, useParcels, useChannelings }
  }
}
</script>

<style scoped>
</style>
