function metacoinRoutes($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.when('', '/metacoin');
  $urlRouterProvider.when('/', '/metacoin');

  $stateProvider
    .state('metacoin', {
      url: '/metacoin',
      component: 'metacoin'
    })
}

export default metacoinRoutes;
