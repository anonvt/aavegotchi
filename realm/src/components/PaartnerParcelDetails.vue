<template>
  <div
    v-if="paartnerDetails"
    class="paartner-parcel-details site-card"
  >
    <SiteButton
      type="button"
      style="float: right; display: flex;"
      title="Close"
      @click="$emit('close')"
    >
      <span class="sr-only">Close</span>
      <SiteIcon name="cancel" />
    </SiteButton>

    <h2>Paartner Parcel:</h2>

    <div style="display: flex; flex-wrap: wrap">
      <img
        :src="paartnerDetails.logoUrl"
        class="paartner-logo"
      />

      <div style="margin: 15px 0;font-weight: bold;">
        {{ paartnerDetails.label }}
      </div>
    </div>

    <div
      v-if="paartnerDetails.website"
      style="margin: 15px 0;font-weight: bold;"
      class="word-break"
    >
      <a
        :href="paartnerDetails.website"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        {{ paartnerDetails.website }}
      </a>
    </div>

    <div
      v-if="paartnerDetails.twitter"
      style="margin: 15px 0;font-weight: bold;"
    >
      <a
        :href="`https://twitter.com/${paartnerDetails.twitter}`"
        target="_blank"
        rel="nofollow noopener noreferrer"
        title="twitter"
      >
        @{{ paartnerDetails.twitter }} twitter
      </a>
    </div>

    <div
      v-if="parcel"
      class="parcel-coords"
    >
      Coordinates:
      ({{ parcel.x }},
      {{ parcel.y }})
      <br>Gotchiverse Coords:
      ({{ parcel.x * 64 }},
      {{ parcel.y * 64 }})
      <br>Dimensions: 64 x 64
    </div>
  </div>
</template>

<script>
import PAARTNER_DETAILS from '@/data/parcels/paartners.json'
import PAARTNER_PARCELS from '@/data/parcels/paartnerParcels.json'

export default {
  props: {
    paartner: { type: String, required: true }
  },
  computed: {
    paartnerDetails () {
      const details = PAARTNER_DETAILS[this.paartner]
      const logoUrl = `/paartners/${details.id}.${details.logo}`
      return {
        ...details,
        logoUrl
      }
    },
    parcel () {
      return PAARTNER_PARCELS.find(parcel => parcel.paartner === this.paartner)
    }
  }
}
</script>

<style scoped>
  .paartner-parcel-details {
    padding: 10px 10px 15px 15px;
  }

  .paartner-logo {
    float: left;
    max-width: 50%;
    max-height: 50px;
    margin-right: 15px;
    margin-bottom: 10px;
  }

  .parcel-coords {
    margin-top: 10px;
    font-size: 0.8em;
    color: var(--site-text-color--subtle);
  }
</style>
