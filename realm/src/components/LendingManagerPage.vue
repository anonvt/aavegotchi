<template>
  <div>
    <div style="margin-bottom: 10px;">
      <h2 style="display: inline; margin-right: 15px;">
        Lending Manager
        <template v-if="address">
          for
          <EthAddress
            :address="address"
            icon
          />
        </template>
        <template v-else-if="thirdPartyAddress">
          for Third-Party
          <EthAddress
            :address="thirdPartyAddress"
            icon
          />
        </template>
        <template v-else-if="vaultOwnerAddress">
          for Vault Depositor
          <EthAddress
            :address="vaultOwnerAddress"
            icon
          />
        </template>
      </h2>
      <template v-if="address">
        (<a
            :href="urlNoAddress"
            @click.prevent="clearAddress"
          >Use another address</a>)
      </template>
    </div>
    <template v-if="address || thirdPartyAddress || vaultOwnerAddress">
      <div v-if="!hasValidAddress">
        Invalid address
      </div>
      <div
        v-else
        style="line-height: 2em;"
      >
        <a
          :href="`https://app.aavegotchi.com/aavegotchis/${encodeURIComponent(address)}`"
          rel="noopener"
          target="_blank"
          style="white-space: nowrap; margin-right: 20px;"
        >
          View gotchis on aavegotchi.com
          <SiteIcon name="open-window" />
        </a>

        <router-link
          v-if="address || vaultOwnerAddress"
          :to="{ name: 'lending-lands', query: { address: address || vaultOwnerAddress } }"
          style="white-space: nowrap;"
        >
          <SiteIcon name="home" style="margin-right: 2px" />
          View lands belonging to
          {{ (address || vaultOwnerAddress).substring(0, 5) }}
        </router-link>
      </div>
    </template>
    <template v-else>
      <form
        style="display: flex; flex-wrap: wrap; column-gap: 10px;"
        @submit.prevent="enterAddress"
      >
        <label>
          Address that owns gotchis:
          <input
            v-model="inputAddress"
            type="text"
          />
        </label>
        <SiteButton
          type="submit"
          :disabled="!inputAddress"
        >
          Use this address
        </SiteButton>
      </form>

      <div style="margin: 15px 0 15px 40px">
        -- OR --
      </div>

      <form
        style="display: flex; flex-wrap: wrap; column-gap: 10px;"
        @submit.prevent="enterThirdPartyAddress"
      >
        <label>
          Third-Party receiving share:
          <input
            v-model="inputThirdPartyAddress"
            type="text"
          />
        </label>
        <SiteButton
          type="submit"
          :disabled="!inputThirdPartyAddress"
        >
          Use this address
        </SiteButton>
      </form>

      <div style="margin: 15px 0 15px 40px">
        -- OR --
      </div>

      <form
        style="display: flex; flex-wrap: wrap; column-gap: 10px;"
        @submit.prevent="enterVaultOwnerAddress"
      >
        <label>
          Depositor of Vault gotchis:
          <input
            v-model="inputVaultOwnerAddress"
            type="text"
          />
        </label>
        <SiteButton
          type="submit"
          :disabled="!inputVaultOwnerAddress"
        >
          Use this address
        </SiteButton>
      </form>
    </template>
    <div
      v-if="hasValidAddress"
      style="margin-top: 20px;"
    >
      <LendingManagerGotchis
        :key="address"
        :address="address"
        :thirdPartyAddress="thirdPartyAddress"
        :vaultOwnerAddress="vaultOwnerAddress"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import EthAddress from './EthAddress.vue'
import LendingManagerGotchis from './LendingManagerGotchis.vue'

export default {
  components: {
    EthAddress,
    LendingManagerGotchis
  },
  props: {
    address: { type: String, default: null },
    thirdPartyAddress: { type: String, default: null },
    vaultOwnerAddress: { type: String, default: null }
  },
  setup (props) {
    const router = useRouter()
    const urlNoAddress = router.resolve({ name: 'lending-manager' }).href

    const inputAddress = ref('')
    const inputThirdPartyAddress = ref('')
    const inputVaultOwnerAddress = ref('')

    const validAddress = computed(() => props.address?.length === 42)
    const validThirdPartyAddress = computed(() => props.thirdPartyAddress?.length === 42)
    const validVaultOwnerAddress = computed(() => props.vaultOwnerAddress?.length === 42)

    const hasValidAddress = computed(() => validAddress.value || validThirdPartyAddress.value || validVaultOwnerAddress.value)

    const clearAddress = () => {
      router.push({
        name: 'lending-manager'
      })
    }

    const enterAddress = () => {
      router.push({
        name: 'lending-manager',
        query: {
          address: inputAddress.value
        }
      })
    }

    const enterThirdPartyAddress = () => {
      router.push({
        name: 'lending-manager',
        query: {
          thirdPartyAddress: inputThirdPartyAddress.value
        }
      })
    }

    const enterVaultOwnerAddress = () => {
      router.push({
        name: 'lending-manager',
        query: {
          vaultOwnerAddress: inputVaultOwnerAddress.value
        }
      })
    }

    return {
      urlNoAddress,
      clearAddress,
      inputAddress,
      inputThirdPartyAddress,
      inputVaultOwnerAddress,
      enterAddress,
      enterThirdPartyAddress,
      enterVaultOwnerAddress,
      hasValidAddress
    }
  }
}
</script>

<style scoped>
</style>
