function metacoinRoutes($stateProvider, $urlRouterProvider) {

  // $urlRouterProvider.when('', '/metacoin');
  // $urlRouterProvider.when('/', '/metacoin');

  $stateProvider
    .state('crc', {
      url: '/crc',
      component: 'crc'
    })
}

export default metacoinRoutes;
