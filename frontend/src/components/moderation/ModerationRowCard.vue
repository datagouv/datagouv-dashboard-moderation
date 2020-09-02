<template>

  <b-card
    :header="hasHeader && `${$t('moderation.moderation', {prefix: ''})}`"
    >
    <div v-if="item">
      <b-row class="mb-2">
        <b-col sm="3" class="text-sm-right"><b>
          {{ $t('moderation.read') }}:</b></b-col>
        <b-col>{{ item.read }}</b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col sm="3" class="text-sm-right"><b>
          {{ $t('moderation.suspect') }}:</b></b-col>
        <b-col>{{ item.suspect }}</b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col sm="3" class="text-sm-right"><b>
          {{ $t('moderation.comments') }}:</b></b-col>
        <b-col>{{ item.comments }}</b-col>
      </b-row>
    </div>
  </b-card>

</template>

<script>
export default {
  name: 'ModerationRowCard',
  props: [
    'hasHeader',
    'item'
  ]
}
</script>
