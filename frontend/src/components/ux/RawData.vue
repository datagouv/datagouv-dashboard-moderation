<template>

  <b-card
    no-body
    :class="customClass"
    v-if="dataRaw"
    >
    <b-card-header
      header-tag="header"
      class="p-1"
      role="tab"
      >
      <b-button
        block
        v-b-toggle.accordion-data
        variant="secondary"
        @click="seeRaw = !seeRaw"
        >
        <span v-if="title" class="font-weight-bold">
          {{title}} :
        </span>

        <span v-if="!seeRaw">
          see
        </span>
        <span v-else>
          hide
        </span>
        raw data

        <b-icon
          :icon="`chevron-${ seeRaw ? 'up' : 'down' }`"
          aria-hidden="true"
          >
        </b-icon>

      </b-button>
    </b-card-header>
    <b-collapse
      id="accordion-data"
      :visible="seeRaw"
      accordion="accordion-data"
      role="tabpanel"
      >
      <b-card-body>
        <b-card-text class="text-left">
          <code>
            <pre>
              {{ dataRaw }}
            </pre>
          </code>
        </b-card-text>
      </b-card-body>
    </b-collapse>
  </b-card>

</template>

<script>
export default {
  name: 'RawData',
  props: [
    'see',
    'title',
    'customClass',
    'dataRaw'
  ],
  data () {
    return {
      seeRaw: false
    }
  },
  created () {
    this.seeRaw = this.see
  }
}
</script>
