import { ref, computed } from 'vue'
import useStatus from '@/data/useStatus'
import useParcels from '@/data/useParcels'

// Fetch all gotchis to find their escrow addresses
const channelings = ref([])
const { parcelsById } = useParcels()

const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aavegotchi/gotchiverse-matic'

const { status: fetchStatus, setLoading } = useStatus()

const canSubmitFetch = computed(() => !fetchStatus.value.loading)

const initChannelings = function () {
  if (!canSubmitFetch.value) {
    return
  }
  const [isStale, setLoaded, setError] = setLoading()
  const startDate = new Date()
  fetch(SUBGRAPH_URL, {
    method: 'POST',
    body: JSON.stringify({
      query: `{
        channelAlchemicaEvents(orderBy: timestamp, orderDirection: desc, where: { timestamp_gte: ${Math.floor(startDate / 1000) - 60 * 10} }) {
            spilloverRadius
            parcel {
              id
            }
            timestamp
        }
      }`
    })
  }).then(async response => {
    if (isStale()) { console.log('Stale request, ignoring'); return }
    if (!response.ok) {
      setError('There was an error fetching channelings')
    }
    const responseJson = await response.json()
    if (responseJson.data?.channelAlchemicaEvents) {
      channelings.value = responseJson.data.channelAlchemicaEvents
      for (const channel of channelings.value) {
        channel.x = parcelsById.value[channel.parcel.id].coordinateX
        channel.y = parcelsById.value[channel.parcel.id].coordinateY
      }

      setLoaded()
    } else {
      throw new Error('Unexpected channelings response ' + JSON.stringify(responseJson))
    }
  }).catch(error => {
    console.error(error)
    setError('Error loading channelings')
  })
}

export default function useChannelings () {
  return {
    initChannelings,
    channelings,
    canSubmitFetch,
    fetchStatus
  }
}
