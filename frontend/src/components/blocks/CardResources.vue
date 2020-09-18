<template>
  <b-card-text
    id="item-resources"
    class="mb-5"
    >
    <b-container
      fluid
      class="my-5 mb-4"
      >
      <b-row>
        <b-col
          md="10"
          offset-md="2"
          class="h3 text-left mb-0"
          >
          <span class="text-capitalize">
            {{ $t('basics.resources', { list: '' }) }}
          </span>
          <b-badge pill variant="light" class="badge-shift h4">
            {{ resources.length }}
          </b-badge>
        </b-col>
      </b-row>
    </b-container>

    <b-table
      v-if="resources"
      striped hover
      :fields="fields"
      :items="resources"
      >
      <template v-slot:cell(title)="data">
        <!-- <router-link
          :to="`/resource/${data.item.id}`"
          >
          <b>{{ data.item.title }}</b>
        </router-link> -->
        <b>{{ data.item.title }}</b>
      </template>

      <template v-slot:cell(actions)="row">
        <b-button
          size="sm"
          @click="info(row.item, row.index, $event.target)"
          class="mr-1"
          >
          {{$t('basics.infos')}}
        </b-button>
      </template>

      <template v-slot:cell(url)="data">
        <b-button variant="outline-primary" :href="data.value" target="_blank">
          <b-icon icon="link" aria-hidden="true"></b-icon>
        </b-button>
      </template>
    </b-table>

    <!-- RESOURCE MODAL -->
    <b-modal
      centered
      size="lg"
      :id="infoModal.id"
      ok-only
      @hide="resetInfoModal"
      >
      <template v-slot:modal-header="{ close }">
        <h5 class="text-center">
          {{ infoModal.title }}
        </h5>
        <b-button-close
          size="sm"
          @click="close()"
          >
        </b-button-close>
      </template>

      <template v-slot:default>
        <code>
          <pre>
            {{ infoModal.content }}
          </pre>
        </code>
      </template>

    </b-modal>

  </b-card-text>
</template>

<script>
export default {
  name: 'CardResources',
  props: [
    'resources'
  ],
  data () {
    return {
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      fields: [
        'title',
        { key: 'actions', label: 'Actions' },
        { key: 'title', stickyColumn: true, isRowHeader: true },
        { key: 'url', label: 'resource url' },
        { key: 'mime', stickyColumn: true },
        'filesize',
        'id'
      ]
    }
  },
  methods: {
    info (item, index, button) {
      this.infoModal.title = `${item.title}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal () {
      this.infoModal.title = ''
      this.infoModal.content = ''
    }
  }
}
</script>

<style scoped>
  .badge-shift {
    vertical-align:text-top;
  }
</style>
