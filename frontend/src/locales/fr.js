
const translations = {
  fr: {
    navbar: {
      title: 'tableau de bord modération'
    },
    locales: {
      choose: 'choisissez votre langue'
    },
    navigation: {
      back: 'retour',
      from: 'depuis'
    },
    popovers: {
      dgfEndpoint: 'API endpoint dans data.gouv.fr'
    },
    toastsModeration: {
      error: 'erreur modération',
      errorTxt: 'code erreur : {code}',
      success: 'success',
      successTxt: 'modération enregistrée',
      successTxt_GET: 'données modération récupérées',
      successTxt_POST: 'données modération ajoutées',
      successTxt_PUT: 'données modération mises à jour',
      successTxt_DELETE: 'données modération supprimées'
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
      name: 'Accueil',
      intro: 'Bienvenue sur le tableau de bord de modération <br>de datagouv',
      connect: 'connectez-vous',
      hello: 'bonjour {name}'
    },
    auth: {
      authorizeClientId: "Autoriser l'ID client",
      loginClientId: "Connexion avec l'ID client",
      logOut: 'déconnexion',
      resetApiClient: "réinitialisation de l'API client",
      setToken: 'Setting token'
    },
    basics: {
      list: 'liste des ',
      redirection: 'redirection',
      suggestions: 'suggestions de ',
      datasets: '{list}jeux de données',
      reuses: '{list}réutilisations',
      users: '{list}utilisateurs',
      organizations: '{list}organisations',
      issues: '{list}anomalies',
      discussions: '{list}discussions',
      resources: '{list}ressources',
      community_resources: '{list}ressources communautaires',
      datasetsCap: 'Jeux de données',
      reusesCap: 'Réutilisations',
      usersCap: 'Utilisateurs',
      organizationsCap: 'Organisations',
      issuesCap: 'Anomalies',
      discussionsCap: 'Discussions',
      resourcesCap: 'Ressources',
      community_resourcesCap: 'Ressources communautaires',
      settings: 'préférences',
      activity: 'activité',
      infos: 'infos',
      profile: 'profil',
      details: 'détails',
      detailsOf: 'les détails de {suffix}',
      dataset: 'jeu de données',
      reuse: 'réutilisation',
      user: 'utilisateur',
      organization: 'organisation',
      issue: 'anomalie',
      discussion: 'discussion',
      resource: 'ressource',
      community_resource: 'ressource communautaire'
    },
    settings: {
      getUserData: 'récupération de vos données utilisateur ...',
      myProfile: 'mon profil',
      authenticate: "s'authentifier",
      logIn: 'se connecter',
      logOut: 'se déconnecter'
    },
    actions: {
      actions: 'actions',
      actionsGroupText: 'actions groupées',
      select: 'sélectionner',
      search: 'rechercher',
      searchDataset: 'rechercher un jeu de données',
      searchFor: 'rechercher un.e {target}',
      edit: 'modifier',
      spotlight: 'mettre en avant',
      contactProducer: 'contacter le producteur',
      follow: 'suivre',
      share: 'partager',
      reportIssue: 'signaler une anomalie',
      save: 'sauver',
      comment: 'commenter',
      confirm: 'confirmer',
      close: 'fermer',
      cancel: 'annuler',
      reset: 'reset',
      delete: 'supprimer',
      show: 'montrer',
      hide: 'cacher',
      wait: 'merci de patienter'
    },
    dialogs: {
      sure: 'êtes-vous certain.e ?',
      sureDelete: 'êtes-vous certain.e de vouloir supprimer ces éléments ?',
      sureDeleteItem: 'êtes-vous certain.e de vouloir supprimer cet élément ?'
    },
    moderation: {
      field: 'champ',
      date: 'date',
      author: 'auteur.e',
      selection: 'sélection',
      read: 'lu',
      suspicious: 'suspect',
      comments: 'commentaires',
      addComment: 'ajouter un commentaire',
      enterComment: 'écrivez ici votre commentaire...',
      deleted: 'supprimé',
      moderation: '{prefix}modération',
      moderationInfos: 'ouvrir les informations de modération',
      moderationFor: 'modération pour',
      markAsRead: 'marquer comme lu(s)',
      markAsSuspect: 'marquer comme suspect(s)'
    },
    model: {
      created: 'créé',
      created_at: 'créé le',
      last_update: 'dernière mise à jour',
      last_modified: 'dernière modification',
      closed: 'fermé',
      closed_by: 'fermé le',
      since: 'depuis',
      temporal_coverage: 'période temporelle',
      frequency: 'fréquence',
      frequency_date: 'date fréquence',

      active: 'active',
      private: 'privé',
      archived: 'archivé',
      deleted: 'supprimé',
      featured: 'featured',
      type: 'type',
      metrics: 'métriques',
      tags: 'étiquettes',
      badges: 'badges',
      extra: 'extra',
      class: 'classe',

      owner: 'propriétaire',
      first_name: 'prénom',
      last_name: 'nom de famille',
      roles: 'rôles',
      members: 'membres',
      user: 'utilisateur',

      acronym: 'acronyme',
      title: 'titre',
      subject: 'sujet',
      description: 'description',
      about: 'à propos',

      datasets: 'jeux de données',
      organizations: 'organisations',
      resources: 'ressources',
      discussion: 'discussion',

      image: 'image',
      image_thumbnail: 'image miniature',
      avatar: 'avatar',
      avatar_thumbnail: 'avatar miniature',
      logo: 'logo',
      logo_thumbnail: 'logo miniature',

      url: 'url',
      uri: 'uri',
      website: 'site web',
      slug: 'slug',
      page: 'page',

      license: 'licence',
      spatial: 'spatial',

      followers: 'followers',
      following: 'following',
      views: 'vues',
      reuses: 'réutilisations',

      id: 'id'
    },
    blocks: {
      seeProfile: 'Voir le profil',
      contactProducer: 'Contacter le producteur',
      followProducer: 'Suivre le producteur'
    },
    footer: {
      title: 'tableau de bord de modération de datagouv.fr',
      subtitle: 'un projet DINUM / Etalab'
    }
  }
}

export default translations
