<template>
  <b-card-text>
    <b-container
      fluid
      :class="`my-4 py-5 ${customBgClass ? customBgClass : 'bg-info'}`"
      >
      <b-row>
        <b-col
          md="2"
          class="text-center align-middle"
          align-self="center"
          >
          <b-img
            thumbnail
            fluid
            :src="producerObject.thumbnail"
            :alt="producerObject.name">
          </b-img>
        </b-col>
        <b-col
          md="10"
          class="text-left"
          >
          <h3 class="text-white mb-3">
            {{producerObject.name}}
          </h3>
          <p>
            <ul class="list-unstyled">
              <li
                v-if="!hideFields.includes('seeProfile')"
                class="font-weight-bold"
                >
                <b-icon icon="chevron-right" variant=""></b-icon>
                <router-link
                  class="text-dark"
                  :to="producerObject.internalLink"
                  >
                  {{$t('blocks.seeProfile')}}
                </router-link>
              </li>
              <li class="font-weight-bold">
                <b-icon icon="chevron-right" variant=""></b-icon>
                <b-link
                  class="text-dark"
                  :to="'/'"
                  disabled
                  >
                  {{$t('blocks.contactProducer')}}
                </b-link>
              </li>
              <li class="font-weight-bold">
                <b-icon icon="chevron-right" variant=""></b-icon>
                <b-link
                  class="text-dark"
                  :to="'/'"
                  disabled
                  >
                  {{$t('blocks.followProducer')}}
                </b-link>
              </li>
            </ul>
          </p>
        </b-col>
      </b-row>
    </b-container>
  </b-card-text>
</template>

<script>
export default {
  name: 'CardProducer',
  props: [
    'item',
    'hide',
    'customClass',
    'customBgClass'
  ],
  data () {
    return {
      producerObject: undefined,
      producerType: undefined,
      hideFields: undefined
    }
  },
  created () {
    this.hideFields = this.hide ? this.hide : []
    if (this.item.organization) {
      this.producerObject = {
        id: this.item.organization.id,
        page: this.item.organization.page,
        name: this.item.organization.name,
        image: this.item.organization.logo,
        thumbnail: this.item.organization.logo_thumbnail,
        uri: this.item.organization.uri,
        internalLink: `/organizations/${this.item.organization.id}`
      }
      this.producerType = 'organization'
    } else {
      this.producerObject = {
        id: this.item.owner.id,
        page: this.item.owner.page,
        name: `${this.item.owner.first_name} ${this.item.owner.last_name}`,
        image: this.item.owner.avatar,
        thumbnail: this.item.owner.avatar_thumbnail,
        uri: this.item.owner.uri,
        internalLink: `/users/${this.item.owner.id}`
      }
      this.producerType = 'user'
    }
  }
}
</script>
