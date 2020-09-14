export const APIresponses = {
  success: [200, 201]
}

export const APIoperations = {
  // ACTIVITY
  activityEndpoints: {
    dataset: {
      operationId: 'activity',
      params: [
        { paramKey: 'dataset', itemKey: 'id' }
      ]
    },
    user: {
      operationId: 'activity',
      params: [
        { paramKey: 'user', itemKey: 'id' }
      ]
    },
    organization: {
      operationId: 'activity',
      params: [
        { paramKey: 'org', itemKey: 'id' }
      ]
    }
  },

  // UPDATE
  updateEndpoints: {
    dataset: {
      operationId: 'update_dataset',
      params: [
        { paramKey: 'dataset', itemKey: 'id' }
      ]
    },
    organization: {
      operationId: 'update_organization',
      params: [
        { paramKey: 'org', itemKey: 'id' }
      ]
    },
    resource: {
      operationId: 'update_resources',
      params: [
        { paramKey: 'rid', itemKey: 'rid' }
      ]
    },
    community_resource: {
      operationId: 'update_community_resource',
      params: [
        { paramKey: 'community', itemKey: 'id' }
      ]
    },
    reuse: {
      operationId: 'update_reuse',
      params: [
        { paramKey: 'reuse', itemKey: 'id' }
      ]
    },
    user: {
      operationId: 'update_user',
      params: [
        { paramKey: 'user', itemKey: 'id' }
      ]
    }
  },

  // COMMENT
  commentEndpoints: {
    discussion: {
      operationId: 'comment_discussion',
      params: [
        { paramKey: 'id', itemKey: 'id' }
      ]
    },
    issue: {
      operationId: 'comment_issue',
      params: [
        { paramKey: 'id', itemKey: 'id' }
      ]
    }
  },

  // DELETE
  deleteEndpoints: {
    dataset: {
      operationId: 'delete_dataset',
      params: [
        { paramKey: 'dataset', itemKey: 'id' }
      ]
    },
    discussion: {
      operationId: 'delete_discussion',
      params: [
        { paramKey: 'id', itemKey: 'id' }
      ]
    },
    organization: {
      operationId: 'delete_organization',
      params: [
        { paramKey: 'org', itemKey: 'id' }
      ]
    },
    resource: {
      operationId: 'delete_resource',
      params: [
        { paramKey: 'dataset', itemKey: 'id' },
        { paramKey: 'rid', itemKey: 'rid' }
      ]
    },
    community_resource: {
      operationId: 'delete_community_resource',
      params: [
        { paramKey: 'community', itemKey: 'id' }
      ]
    },
    reuse: {
      operationId: 'delete_reuse',
      params: [
        { paramKey: 'reuse', itemKey: 'id' }
      ]
    },
    user: {
      operationId: 'delete_user',
      params: [
        { paramKey: 'user', itemKey: 'id' }
      ]
    }
  }
}
