<template>
  <b-row
    align-h="between"
    :class="customClass"
    >

    <b-col
      v-if="!compact"
      :cols="compact ? 4 : 3"
      align-self="start"
      class="text-left pl-5"
      >
      <PreviousPage/>
    </b-col>

    <b-col
      :cols="compact ? 8 : 6"
      align-self="center"
      :class="compact ? 'pl-5 text-left' : 'text-center' "
      >
      <router-link
        v-if="compact"
        class='h2 text-dark'
        :to="dict[dgfType].to"
        >
        {{ $t(dict[dgfType].textCode) }}
        <b-icon icon="link45deg" aria-hidden="true"></b-icon>
      </router-link>
      <h2 v-else>
        {{ $t(dict[dgfType].textCode) }}
      </h2>
      <template
        v-show="!noSubtitle"
        >
        <slot
          v-if="!noSubtitle"
          name="subtitle"
          >
        </slot>
      </template>
    </b-col>

    <b-col
      :cols="compact ? 4 : 3"
      class="text-right pr-5"
      >
      <slot name="badge"></slot>
    </b-col>

  </b-row>
</template>

<script>
import PreviousPage from '@/components/ux/PreviousPage.vue'

export default {
  name: 'PageHeader',
  components: {
    PreviousPage
  },
  props: [
    'dgfType',
    'linkTitle',
    'compact',
    'noSubtitle',
    'customClass'
  ],
  data () {
    return {
      dict: {
        datasets: {
          textCode: 'basics.datasetsCap',
          to: '/datasets'
        },
        reuses: {
          textCode: 'basics.reusesCap',
          to: '/reuses'
        },
        users: {
          textCode: 'basics.usersCap',
          to: '/users'
        },
        organizations: {
          textCode: 'basics.organizationsCap',
          to: '/organizations'
        },
        issues: {
          textCode: 'basics.issuesCap',
          to: '/issues'
        },
        discussions: {
          textCode: 'basics.discussionsCap',
          to: '/discussions'
        },
        resources: {
          textCode: 'basics.resourcesCap',
          to: '/resources'
        },
        resources_community: {
          textCode: 'basics.resources_communityCap',
          to: '/resources-community'
        }
      }
    }
  }
}
</script>
