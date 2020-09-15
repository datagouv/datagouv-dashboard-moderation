
const translations = {
  en: {
    navbar: {
      title: 'moderation dashboard'
    },
    locales: {
      choose: 'choose your language'
    },
    navigation: {
      back: 'back',
      from: 'from'
    },
    popovers: {
      dgfEndpoint: 'API endpoint in data.gouv.fr'
    },
    toastsModeration: {
      error: 'moderation error',
      errorTxt: 'error code : {code}',
      success: 'success',
      successTxt: 'moderation recorded',
      successTxt_GET: 'moderation data retrieved',
      successTxt_POST: 'moderation data added',
      successTxt_PUT: 'moderation data updated',
      successTxt_DELETE: 'moderation data deleted'
    },
    responseCodes: {
      _200: 'success',
      _201: 'update success',
      _400: 'Model validation error',
      _401: 'Unauthorized',
      _403: 'Not enough privileges',
      _404: 'Not found',
      _405: 'Method not allowed',
      _500: 'Internal server error'
    },
    home: {
      name: 'Home',
      intro: 'Welcome to the datagouv <br>moderation dashboard',
      connect: 'please connect',
      hello: 'hello {name}'
    },
    auth: {
      authorizeClientId: 'Authorize client ID',
      loginClientId: 'Login with Client ID',
      logOut: 'log out',
      resetApiClient: 'Reset API client',
      setToken: 'Setting token'
    },
    basics: {
      list: ' list',
      redirection: 'redirection',
      suggestions: ' suggestions',
      datasets: 'datasets{list}',
      reuses: 'reuses{list}',
      users: 'users{list}',
      organizations: 'organizations{list}',
      issues: 'issues{list}',
      discussions: 'discussions{list}',
      resources: 'ressources{list}',
      community_resources: 'community ressources{list}',
      datasetsCap: 'Datasets',
      reusesCap: 'Reuses',
      usersCap: 'Users',
      organizationsCap: 'Organizations',
      issuesCap: 'Issues',
      discussionsCap: 'Discussions',
      resourcesCap: 'Ressources',
      community_resourcesCap: 'Community ressources',
      settings: 'settings',
      activity: 'activity',
      infos: 'infos',
      profile: 'profile',
      details: 'détails',
      detailsOf: 'the details de {suffix}',
      dataset: 'dataset',
      reuse: 'reuse',
      user: 'user',
      organization: 'organisation',
      issue: 'issue',
      discussion: 'discussion',
      resource: 'ressource',
      community_resource: 'communautary ressource'
    },
    settings: {
      getUserData: 'getting your user data ...',
      myProfile: 'my profile',
      authenticate: 'authenticate',
      logIn: 'log in',
      logOut: 'log out'
    },
    actions: {
      actions: 'actions',
      actionsGroupText: 'grouped actions',
      select: 'select',
      search: 'search',
      searchDataset: 'search for a dataset',
      searchFor: 'search for a {target}',
      edit: 'edit',
      spotlight: 'spotlight',
      contactProducer: 'contact the producer',
      follow: 'follow',
      share: 'share',
      reportIssue: 'report an issue',
      save: 'save',
      comment: 'comment',
      confirm: 'confirm',
      close: 'close',
      cancel: 'cancel',
      reset: 'reset',
      delete: 'delete',
      show: 'show',
      hide: 'hide',
      wait: 'please wait'
    },
    dialogs: {
      sure: 'are you sure ?',
      sureDelete: 'are you sure you want to delete those elements ?',
      sureDeleteItem: 'are you sure you want to delete this element ?'
    },
    moderation: {
      field: 'champ',
      date: 'date',
      author: 'author',
      selection: 'selection',
      read: 'read',
      suspicious: 'suspicious',
      deleted: 'deleted',
      comments: 'comments',
      addComment: 'add a comment',
      enterComment: 'write your comment here...',
      moderation: '{prefix}moderation',
      moderationFor: 'moderation for',
      markAsRead: 'mark as read',
      markAsSuspect: 'mark as suspect'
    },
    model: {
      created: 'created',
      created_at: 'created at',
      last_update: 'last update',
      last_modified: 'last modified',
      closed: 'closed',
      closed_by: 'closed by',
      since: 'since',
      temporal_coverage: 'temporal coverage',
      frequency: 'frequency',
      frequency_date: 'frequency date',

      active: 'active',
      private: 'private',
      archived: 'archived',
      deleted: 'deleted',
      featured: 'featured',
      type: 'type',
      metrics: 'metrics',
      tags: 'tags',
      badges: 'badges',
      extra: 'extra',
      class: 'class',

      owner: 'owner',
      first_name: 'first name',
      last_name: 'last name',
      roles: 'roles',
      members: 'members',
      user: 'user',

      acronym: 'acronym',
      title: 'title',
      subject: 'subject',
      description: 'description',
      about: 'about',

      datasets: 'datasets',
      organizations: 'organizations',
      resources: 'resources',
      discussion: 'discussion',

      image: 'image',
      image_thumbnail: 'image thumbnail',
      avatar: 'avatar',
      avatar_thumbnail: 'avatar thumbnail',
      logo: 'logo',
      logo_thumbnail: 'logo thumbnail',

      url: 'url',
      uri: 'uri',
      website: 'website',
      slug: 'slug',
      page: 'page',

      license: 'license',
      spatial: 'spatial',

      followers: 'followers',
      following: 'following',
      views: 'views',
      reuses: 'reuses',

      id: 'id'
    },
    blocks: {
      seeProfile: 'See profile',
      contactProducer: 'Contact the producer',
      followProducer: 'Follow the producer'
    },
    footer: {
      title: 'datagouv.fr moderation dashboard',
      subtitle: 'a DINUM / Etalab project'
    }
  }
}

export default translations
