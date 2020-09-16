<template>
  <b-card-title>
    <b-container
      fluid
      class="mb-5 mt-4"
      >
      <b-row>
        <b-col
          md="8"
          offset-md="2"
          :class="`h1 text-left ${customClass}`"
          >
          {{title}}
        </b-col>
        <b-col
          md="2"
          >
          <EditItemBtn
            :dgfType="dgfType"
            :endpoint="putOperationId"
            :item="dataset"
            :hideFields="['chat']"
            @responseAction="callbackAction"
            >
          </EditItemBtn>
        </b-col>
      </b-row>
    </b-container>
  </b-card-title>
</template>

<script>
import EditItemBtn from '@/components/ux/EditItemBtn.vue'

export default {
  name: 'CardTitle',
  components: {
    EditItemBtn
  },
  props: [
    'title',
    'customClass',
    'dgfType',
    'endpoint',
    'item',
    'hideFields'
  ],
  data () {
    return {
      edit: false
    }
  },
  methods: {
    callbackAction (evt) {
      switch (evt.category) {
        case 'openEdit':
          this.edit = true
          break
      }
    }
  }
}
</script>
